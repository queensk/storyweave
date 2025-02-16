"use client";
import React, { useState, useEffect } from "react";
import {
  Book,
  Plus,
  Settings,
  Sparkles,
  Library,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Save,
  Trash2,
  Pause,
  Play,
} from "lucide-react";

const storageUtils = {
  saveStories: (stories) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("stories", JSON.stringify(stories));
    }
  },

  getStories: () => {
    if (typeof window !== "undefined") {
      const stories = localStorage.getItem("stories");
      return stories ? JSON.parse(stories) : [];
    }
    return [];
  },
};

// API Utilities
const apiUtils = {
  generateStory: async (title, style) => {
    const response = await fetch("/api/generate-story", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, style }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate story");
    }

    return response.json();
  },
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
    <span>Generating...</span>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div
    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-2"
    role="alert"
  >
    <span className="block sm:inline">{message}</span>
  </div>
);

const AudioPlayer = ({ story }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlayPause = async () => {
    if (!audio) {
      setIsLoading(true);
      try {
        const response = await fetch("/api/text-to-speech", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: story.content,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate audio");
        }

        const { audioData } = await response.json();
        const newAudio = new Audio(audioData);

        // Set up audio event listeners
        newAudio.addEventListener("ended", () => {
          setIsPlaying(false);
        });

        newAudio.addEventListener("error", (e) => {
          console.error("Audio playback error:", e);
          setIsPlaying(false);
        });

        setAudio(newAudio);
        await newAudio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Error generating audio:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    }
  };

  // Cleanup on unmount or story change
  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.src = "";
        setAudio(null);
        setIsPlaying(false);
      }
    };
  }, [story.id]);

  return (
    <button
      onClick={handlePlayPause}
      disabled={isLoading}
      className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-lg ${
        isPlaying
          ? "bg-red-500 hover:bg-red-600"
          : "bg-blue-500 hover:bg-blue-600"
      } text-white transition-colors disabled:bg-gray-400`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
          <span>Generating audio...</span>
        </div>
      ) : (
        <>
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              <span>Play Story</span>
            </>
          )}
        </>
      )}
    </button>
  );
};

const StoryDashboard = () => {
  const [stories, setStories] = useState(() => storageUtils.getStories());
  const [newStoryTitle, setNewStoryTitle] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("Fantasy");
  const [activeStory, setActiveStory] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const storyStyles = [
    "Fantasy",
    "Sci-Fi",
    "Mystery",
    "Romance",
    "Adventure",
    "Horror",
    "Historical Fiction",
    "Comedy",
  ];

  useEffect(() => {
    storageUtils.saveStories(stories);
  }, [stories]);

  const handleGenerateStory = async () => {
    if (newStoryTitle.trim()) {
      setIsGenerating(true);
      setError(null);

      try {
        const data = await apiUtils.generateStory(newStoryTitle, selectedStyle);

        const newStory = {
          id: Date.now(),
          title: data.title,
          style: data.style,
          chapters: data.chapters,
          status: data.status,
          content: data.story,
          dateCreated: new Date().toISOString(),
          comments: [],
        };

        setStories((prevStories) => [...prevStories, newStory]);
        setNewStoryTitle("");
        setActiveStory(newStory);
      } catch (error) {
        setError("Failed to generate story. Please try again.");
        console.error("Error generating story:", error);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const saveStory = (story) => {
    const updatedStory = {
      ...story,
      status: "completed",
      lastModified: new Date().toISOString(),
    };

    setStories((prevStories) =>
      prevStories.map((s) => (s.id === story.id ? updatedStory : s))
    );
    setActiveStory(updatedStory);
  };

  const deleteStory = (storyId) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      setStories((prevStories) =>
        prevStories.filter((story) => story.id !== storyId)
      );
      if (activeStory?.id === storyId) {
        setActiveStory(null);
      }
    }
  };

  const addComment = (storyId, commentText) => {
    if (commentText.trim()) {
      const newComment = {
        id: Date.now(),
        text: commentText,
        timestamp: new Date().toISOString(),
      };

      setStories((prevStories) =>
        prevStories.map((story) => {
          if (story.id === storyId) {
            return {
              ...story,
              comments: [...(story.comments || []), newComment],
            };
          }
          return story;
        })
      );
    }
  };

  const CommentSection = () => (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Comments ({activeStory?.comments?.length || 0})
        </h3>
      </div>
      <div className="space-y-2">
        {activeStory?.comments?.map((comment) => (
          <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
            <p>{comment.text}</p>
            <small className="text-gray-500">
              {new Date(comment.timestamp).toLocaleString()}
            </small>
          </div>
        ))}
        <input
          type="text"
          placeholder="Add a comment..."
          className="w-full p-2 border rounded-lg"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              addComment(activeStory.id, e.target.value);
              e.target.value = "";
            }
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Book className="h-6 w-6 text-blue-500" />
              <h1 className="text-xl font-bold">Story Generator Dashboard</h1>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="border-b pb-3 mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create New Story
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Story Title
                  </label>
                  <input
                    type="text"
                    value={newStoryTitle}
                    onChange={(e) => setNewStoryTitle(e.target.value)}
                    placeholder="Enter story title..."
                    className="w-full p-2 border rounded-lg"
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Story Style
                  </label>
                  <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    {storyStyles.map((style) => (
                      <option key={style} value={style}>
                        {style}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleGenerateStory}
                  disabled={isGenerating || !newStoryTitle.trim()}
                  className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Story
                    </>
                  )}
                </button>
                {error && <ErrorMessage message={error} />}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="border-b pb-3 mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Library className="h-5 w-5" />
                  Your Stories ({stories.length})
                </h2>
              </div>
              <div className="space-y-2">
                {stories.map((story) => (
                  <div
                    key={story.id}
                    onClick={() => setActiveStory(story)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      activeStory?.id === story.id
                        ? "bg-blue-50 border-blue-200"
                        : "hover:bg-gray-50 border-gray-200"
                    } border`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{story.title}</h3>
                        <p className="text-sm text-gray-500">
                          {story.style} •{" "}
                          {new Date(story.dateCreated).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          story.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {story.status}
                      </span>
                    </div>
                  </div>
                ))}
                {stories.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    No stories yet. Create your first story!
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            {activeStory ? (
              <div className="bg-white rounded-lg shadow-sm h-full">
                <div className="border-b p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Book className="h-5 w-5" />
                      <h2 className="text-lg font-semibold">
                        {activeStory.title}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => saveStory(activeStory)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteStory(activeStory.id)}
                        className="p-2 hover:bg-red-100 rounded-lg text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="p-4">
                    <div className="space-y-4">
                      <div className="prose max-w-none">
                        <p className="text-lg leading-relaxed">
                          {activeStory.content || "No content available"}
                        </p>
                      </div>
                      <AudioPlayer story={activeStory} />
                      <CommentSection />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Book className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Select a story to view or create a new one</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryDashboard;

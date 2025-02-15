"use client";
import React, { useState } from "react";
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
} from "lucide-react";

const StoryDashboard = () => {
  const [stories, setStories] = useState([
    {
      id: 1,
      title: "The Hidden Gateway",
      style: "Fantasy",
      chapters: 2,
      status: "in-progress",
    },
    {
      id: 2,
      title: "Echoes of Tomorrow",
      style: "Sci-Fi",
      chapters: 5,
      status: "completed",
    },
  ]);
  const [newStoryTitle, setNewStoryTitle] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("Fantasy");
  const [activeStory, setActiveStory] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleGenerateStory = () => {
    if (newStoryTitle.trim()) {
      setIsGenerating(true);
      // Simulate API call
      setTimeout(() => {
        const newStory = {
          id: stories.length + 1,
          title: newStoryTitle,
          style: selectedStyle,
          chapters: 0,
          status: "in-progress",
        };
        setStories([...stories, newStory]);
        setNewStoryTitle("");
        setIsGenerating(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Sidebar - Story Creation */}
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
                    <>Generating...</>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Story
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Story Library */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="border-b pb-3 mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Library className="h-5 w-5" />
                  Your Stories
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
                          {story.style} • {story.chapters} chapters
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
              </div>
            </div>
          </div>

          {/* Main Content Area - Story Editor */}
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
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Save className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-red-100 rounded-lg text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <span className="font-medium">Chapter 1</span>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="prose max-w-none">
                      <p className="text-lg leading-relaxed">
                        {activeStory.id === 1
                          ? "In the heart of an ancient forest, where shadows danced between twisted trees and time seemed to flow like honey, Sarah discovered a peculiar door..."
                          : "The neon lights of New Shanghai flickered against the rain-slicked streets, casting prismatic reflections across the chrome and glass towers that stretched endlessly into the smog-filled sky..."}
                      </p>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Comments
                        </h3>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          className="w-full p-2 border rounded-lg"
                        />
                      </div>
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

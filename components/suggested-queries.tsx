import { motion } from "framer-motion";
import { Button } from "./ui/button";

export const SuggestedQueries = ({
  handleSuggestionClick,
}: {
  handleSuggestionClick: (suggestion: string) => void;
}) => {
  const suggestionQueries = [
    
    {
      desktop: "Most upvoted posts on Hacker News over time",
      mobile: "Top posts (HN)",
    },
    {
      desktop: "Get top comments for a post on Hacker News",
      mobile: "Top comments (HN)",
    },
    {
      desktop: "Posts with the highest score in the last 24 hours",
      mobile: "High score posts",
    },
    {
      desktop: "Most commented posts in the last week",
      mobile: "Top commented posts",
    },

    {
      desktop: "Show the total number of complaints by type in NYC",
      mobile: "NYC requests by type",
    },
    {
      desktop: "Get the most common complaint types in NYC",
      mobile: "Common complaints in NYC",
    },
    {
      desktop: "Get the most common complaint types by year",
      mobile: "Common complaints by year",
    },

    {
      desktop: "Show average movie rating by genre",
      mobile: "Avg rating by genre",
    },
    {
      desktop: "Top 10 highest-rated movies of all time",
      mobile: "Top rated movies",
    },
    {
      desktop: "Show the most common keywords in movie descriptions",
      mobile: "Common movie keywords",
    },
    {
      desktop: "Get movies with the highest earnings by genre",
      mobile: "Top earning genres",
    },

    {
      desktop: "Compare PM10 and PM2.5 concentration by city",
      mobile: "PM10 vs PM2.5 by city",
    },
    {
      desktop: "Show air quality trends for major cities in 2020",
      mobile: "Air quality trends 2020",
    },
    {
      desktop: "Top cities with the highest NO2 concentration",
      mobile: "Cities with high NO2",
    },
    {
      desktop: "Show air quality data for countries by year",
      mobile: "Air quality by country",
    },
  ];

  return (
    <motion.div
      key="suggestions"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      layout
      exit={{ opacity: 0 }}
      className="h-full overflow-y-auto"
    >
      <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4">
        Try these queries:
      </h2>
      <div className="flex flex-wrap gap-2">
        {suggestionQueries.map((suggestion, index) => (
          <Button
            key={index}
            className={index > 5 ? "hidden sm:inline-block" : ""}
            type="button"
            variant="outline"
            onClick={() => handleSuggestionClick(suggestion.desktop)}
          >
            <span className="sm:hidden">{suggestion.mobile}</span>
            <span className="hidden sm:inline">{suggestion.desktop}</span>
          </Button>
        ))}
      </div>
    </motion.div>
  );
};

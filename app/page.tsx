"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateChartConfig } from "./actions";
import { Config, Result } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ProjectInfo } from "@/components/project-info";
import { Results } from "@/components/results";
import { SuggestedQueries } from "@/components/suggested-queries";
import { QueryViewer } from "@/components/query-viewer";
import { Search } from "@/components/search";
import { Header } from "@/components/header";
import { useMotherDuckClientState } from "@/lib/motherduck/context/motherduckClientContext";

export default function Page() {
  const [inputValue, setInputValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [activeQuery, setActiveQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1);
  const [chartConfig, setChartConfig] = useState<Config | null>(null);
  const [databases, setDatabases] = useState<string[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState<string>("");
  const [isFetchingDatabases, setIsFetchingDatabases] = useState(false);

  const { evaluateQuery } = useMotherDuckClientState();

  const serializeWithBigInt = (data: any): string => {
    return JSON.stringify(data, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    );
  }

  useEffect(() => {
    const fetchDatabases = async () => {
      try {
        setIsFetchingDatabases(true);
        const queryResponse = await evaluateQuery("SHOW DATABASES;");
        const dbList = queryResponse.data
          .toRows()
          .map((row) => row["database_name"])
          .filter((db) => db !== "memory" && db !== "md_information_schema"); // Filter out memory and md_information_schema

        setDatabases(dbList);
        setSelectedDatabase(dbList[0] || "");
        setIsFetchingDatabases(false);
      } catch (error) {
        toast.error("Failed to fetch databases.");
        setIsFetchingDatabases(false);
      }
    };

    fetchDatabases();
  }, [evaluateQuery]);


  const handleSubmit = async (suggestion?: string) => {
    const question = suggestion ?? inputValue;
    if (inputValue.length === 0 && !suggestion) return;
    clearExistingData();
    if (question.trim()) {
      setSubmitted(true);
    }
    setLoading(true);
    setLoadingStep(1);
    setActiveQuery("");

    try {
      await evaluateQuery(`USE ${selectedDatabase};`);
      const queryResponse = await evaluateQuery(`CALL prompt_sql("${question}");`);
      const query = queryResponse.data.toRows()[0].query as string;

      if (!query) {
        toast.error("An error occurred. Please try again.");
        setLoading(false);
        return;
      }

      setActiveQuery(query);
      setLoadingStep(2);

      const queryResults = await evaluateQuery(query);
      const data = queryResults.data.toRows() as Result[] || [];
      const columns = data.length > 0 ? Object.keys(data[0]) : [];

      setResults(data);
      setColumns(columns);
      setLoading(false);
      const graphQuery = `SELECT prompt(
        'Given the following data from a SQL query result, generate the chart config that best visualises the data and answers the user''s query. For multiple groups, use multi-lines.
        
      
         Example config:
         export const chartConfig = {
           type: "pie",
           xKey: "month",
           yKeys: ["sales", "profit", "expenses"],
           colors: {
             sales: "#4CAF50",    -- Green for sales
             profit: "#2196F3",   -- Blue for profit
             expenses: "#F44336"  -- Red for expenses
           },
           legend: true
         }
      
         User Query:
          ${question} 

         Head Data:(having the first 2 rows of the data with the columns)
          ${JSON.stringify(serializeWithBigInt(data.slice(0, 2)), null, 2)}',
         struct := {description: 'VARCHAR', takeaway: 'VARCHAR', type: 'VARCHAR', title: 'VARCHAR', xKey: 'VARCHAR', yKeys: 'VARCHAR[]', legend: 'BOOLEAN'},
         struct_descr := {description: 'A description of the chart, its purpose and insights from the data', takeaway: 'Main takeaway from the chart', type: 'The type of chart to use (bar, line, area, pie)', title: 'The title for the chart', xKey: 'The key to be used for the x-axis', yKeys: 'An array of keys representing the y-axis values', legend: 'Boolean indicating whether to show the legend'}
      ) as config;`
      const graphQueryResults = await evaluateQuery(graphQuery);
      const graphData = graphQueryResults.data.toRows()[0].config?.entries;

      const config = graphData.reduce((acc: any, obj) => {
        // Handle yKeys separately if it's an array or an object
        if (obj.key === "yKeys" && Array.isArray(obj.value.values)) {
          // Remove extra quotes around the values of yKeys
          acc[obj.key] = obj.value.values.map((value: string) =>
            value.replace(/['"]+/g, '') // Strip out any extra quotes
          );
        } else {
          acc[obj.key] = obj.value;
        }
        return acc;
      }, {});

      const colors: Record<string, string> = {};

      // Create color mapping for each yKey without extra quotes
      config.yKeys.forEach((key, index) => {
        colors[key] = `hsl(var(--chart-${index + 1}))`;
      });

      const updatedConfig: Config = { ...config, colors };

      console.log(updatedConfig);


      // const generation = await generateChartConfig(data, question);


      setChartConfig(updatedConfig);
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      setLoading(false);
    }
  };


  const handleSuggestionClick = async (suggestion: string) => {
    setInputValue(suggestion);
    try {
      await handleSubmit(suggestion);
    } catch (e) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const clearExistingData = () => {
    setActiveQuery("");
    setResults([]);
    setColumns([]);
    setChartConfig(null);
  };

  const handleClear = () => {
    setSubmitted(false);
    setInputValue("");
    clearExistingData();
  };

  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 flex items-start justify-center p-0 sm:p-8">
      <div className="w-full max-w-4xl min-h-dvh sm:min-h-0 flex flex-col ">
        <motion.div
          className="bg-card rounded-xl sm:border sm:border-border flex-grow flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="p-6 sm:p-8 flex flex-col flex-grow">
            <Header handleClear={handleClear} />
            <div className="mb-4">
              <label htmlFor="database-selector" className="block mb-2 font-semibold">
                Select Database:
              </label>
              <div className="relative">
                {isFetchingDatabases ? (
                  <div className="absolute inset-0 flex items-center justify-center space-x-2">
                    <span className="text-3xl">🦆</span>
                    <p className="text-lg">fetching databases, Please wait...</p>
                  </div>
                ) : null}
                <select
                  id="database-selector"
                  value={selectedDatabase}
                  onChange={(e) => setSelectedDatabase(e.target.value)}
                  className="w-auto p-2 border rounded"
                >
                  {databases.map((db) => (
                    <option key={db} value={db}>
                      {db}
                    </option>
                  ))}
                </select>
              </div>
            </div>


            <Search
              handleClear={handleClear}
              handleSubmit={handleSubmit}
              inputValue={inputValue}
              setInputValue={setInputValue}
              submitted={submitted}
              disabled={isFetchingDatabases}
            />
            <div
              id="main-container"
              className="flex-grow flex flex-col sm:min-h-[420px]"
            >
              <div className="flex-grow h-full">
                <AnimatePresence mode="wait">
                  {!submitted ? (
                    <SuggestedQueries
                      handleSuggestionClick={handleSuggestionClick}
                    />
                  ) : (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      layout
                      className="sm:h-full min-h-[400px] flex flex-col"
                    >
                      {activeQuery.length > 0 && (
                        <QueryViewer
                          activeQuery={activeQuery}
                          inputValue={inputValue}
                        />
                      )}
                      {loading ? (
                        <div className="h-full w-full absolute inset-0 bg-background/50 flex items-center justify-center space-y-4">
                        <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                        <p className="text-foreground">
                          {loadingStep === 1 ? "Generating SQL query..." : "Running SQL query..."}
                        </p>
                      </div>
                      ) : results.length === 0 ? (
                        <div className="flex-grow flex items-center justify-center">
                          <p className="text-center text-muted-foreground">
                            No results found.
                          </p>
                        </div>
                      ) : (
                        <Results
                          results={results}
                          chartConfig={chartConfig}
                          columns={columns}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          {/* <ProjectInfo /> */}
        </motion.div>
      </div>
    </div>
  );
}

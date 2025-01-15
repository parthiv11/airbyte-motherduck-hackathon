import { useState } from "react";
import { Button } from "./ui/button";
import { QueryWithTooltips } from "./ui/query-with-tooltips";
import { explainQuery } from "@/app/actions";
import { QueryExplanation } from "@/lib/types";
import { CircleHelp, Loader2 } from "lucide-react";
import { useMotherDuckClientState } from "@/lib/motherduck/context/motherduckClientContext";

export const QueryViewer = ({
  activeQuery,
  inputValue,
}: {
  activeQuery: string;
  inputValue: string;
}) => {
  const activeQueryCutoff = 100;

  const [queryExplanations, setQueryExplanations] = useState<
    QueryExplanation[] | null
  >();
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [queryExpanded, setQueryExpanded] = useState(activeQuery.length > activeQueryCutoff);
  const { evaluateQuery } = useMotherDuckClientState();
  
  const transformData = (input) => {
    const sections = input[0].value.values.map(item => item.replace(/^"|"$/g, ''));
    const explanations = input[1].value.values.map(item => item.replace(/^"|"$/g, ''));
  
    return sections.map((section, index) => ({
      section: section,
      explanation: explanations[index]
    }));
  };
  const handleExplainQuery = async () => {
    setQueryExpanded(true);
    setLoadingExplanation(true);
    // const { explanations } = await explainQuery(inputValue, activeQuery);
    const explainQuery = `SELECT prompt(
      $$You are a SQL (motherduck) expert. Your job is to explain to the user write a SQL query you wrote to retrieve the data they asked for. The table schema is as follows:
    When you explain you must take a section of the query in shortest and simplest way, and then explain it. Each 'section' should be unique. So in a query like: SELECT * FROM unicorns limit 20, the sections could be SELECT *, FROM UNICORNS, LIMIT 20.
    If a section doesnt have any explanation, include it, but leave the explanation empty.
    Explain the SQL query you generated to retrieve the data the user wanted. Assume the user is not an expert in SQL. Break down the query into steps. Be concise.

      User Query:
      ${inputValue}

      Generated SQL Query:
      ${activeQuery}
$$,
  struct:={section:'VARCHAR[]',explanation:'VARCHAR[]'}
    ) as config;`

    const explainQueryResults = await evaluateQuery(explainQuery);
    const explainData = explainQueryResults.data.toRows()[0].config?.entries ;
    const explanations = transformData(explainData);
    setQueryExplanations(explanations);
    setLoadingExplanation(false);
  };

  if (activeQuery.length === 0) return null;

  return (
    <div className="mb-4 relative group">
      <div
        className={`bg-muted rounded-md p-4 ${queryExpanded ? "" : "text-muted-foreground"}`}
      >
        <div className="font-mono text-sm">
          {queryExpanded ? (
            queryExplanations && queryExplanations.length > 0 ? (
              <>
                <QueryWithTooltips
                  query={activeQuery}
                  queryExplanations={queryExplanations}
                />
                <p className="font-sans mt-4 text-base">
                  Generated explanation! Hover over different parts of the SQL
                  query to see explanations.
                </p>
              </>
            ) : (
              <div className="flex justify-between items-center">
                <span className="">{activeQuery}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleExplainQuery}
                  className="h-fit hover:text-muted-foreground hidden sm:inline-block"
                  aria-label="Explain query"
                  disabled={loadingExplanation}
                >
                  {loadingExplanation ? (
                    <Loader2 className="h-10 w-10 p-2 animate-spin " />
                  ) : (
                    <CircleHelp className="h-10 w-10 p-2 " />
                  )}
                </Button>
              </div>
            )
          ) : (
            <span>
              {activeQuery.slice(0, activeQueryCutoff)}
              {activeQuery.length > activeQueryCutoff ? "..." : ""}
            </span>
          )}
        </div>
      </div>
      {!queryExpanded && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setQueryExpanded(true)}
          className="absolute inset-0 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
        >
          Show full query
        </Button>
      )}
    </div>
  );
};

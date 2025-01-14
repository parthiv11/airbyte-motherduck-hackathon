"use server";

import { Config, configSchema, explanationsSchema, Result } from "@/lib/types";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";


export const explainQuery = async (input: string, sqlQuery: string) => {
  "use server";
  try {
    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: z.object({
        explanations: explanationsSchema,
      }),
      system: `You are a SQL (motherduck) expert. Your job is to explain to the user write a SQL query you wrote to retrieve the data they asked for. The table schema is as follows:

    When you explain you must take a section of the query, and then explain it. Each "section" should be unique. So in a query like: "SELECT * FROM unicorns limit 20", the sections could be "SELECT *", "FROM UNICORNS", "LIMIT 20".
    If a section doesnt have any explanation, include it, but leave the explanation empty.

    `,
      prompt: `Explain the SQL query you generated to retrieve the data the user wanted. Assume the user is not an expert in SQL. Break down the query into steps. Be concise.

      User Query:
      ${input}

      Generated SQL Query:
      ${sqlQuery}`,
    });
    return result.object;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to generate query");
  }
};

export const generateChartConfig = async (
  results: Result[],
  userQuery: string,
) => {
  "use server";
  const system = `You are a data visualization expert. `;

  try {
    const { object: config } = await generateObject({
      model: openai("gpt-4o-mini"),
      system,
      prompt: `Given the following data from a SQL query result, generate the chart config that best visualises the data and answers the users query.
      For multiple groups use multi-lines.

      Here is an example complete config:
      export const chartConfig = {
        type: "pie",
        xKey: "month",
        yKeys: ["sales", "profit", "expenses"],
        colors: {
          sales: "#4CAF50",    // Green for sales
          profit: "#2196F3",   // Blue for profit
          expenses: "#F44336"  // Red for expenses
        },
        legend: true
      }

      User Query:
      ${userQuery}

      Data:
      ${JSON.stringify(serializeWithBigInt(results.slice(0,6)), null, 2)}`,
      schema: configSchema,
    });

    const colors: Record<string, string> = {};
    config.yKeys.forEach((key, index) => {
      colors[key] = `hsl(var(--chart-${index + 1}))`;
    });

    const updatedConfig: Config = { ...config, colors };
    return { config: updatedConfig };
  } catch (e) {
    // @ts-expect-errore
    console.error(e);
    throw new Error("Failed to generate chart suggestion");
  }
};

function serializeWithBigInt(data: any): string {
  return JSON.stringify(data, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
}

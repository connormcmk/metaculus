"use client";
import classNames from "classnames";
import Link from "next/link";
import { FC, useState } from "react";
import { VictoryThemeDefinition } from "victory";

import FanChart from "@/components/charts/fan_chart";
import NumericChart from "@/components/charts/numeric_chart";
import ConditionalTile from "@/components/conditional_tile";
import MultipleChoiceTile from "@/components/multiple_choice_tile";
import PredictionChip from "@/components/prediction_chip";
import { PostWithForecasts } from "@/types/post";
import { QuestionType, QuestionWithNumericForecasts } from "@/types/question";
import {
  generateChoiceItemsFromBinaryGroup,
  generateChoiceItemsFromMultipleChoiceForecast,
  getFanOptionsFromNumericGroup,
  getGroupQuestionsTimestamps,
  getNumericChartTypeFromQuestion,
} from "@/utils/charts";

type Props = {
  post: PostWithForecasts;
  className?: string;
  chartHeight?: number;
  chartTheme?: VictoryThemeDefinition;
  nonInteractive?: boolean;
};

const ForecastCard: FC<Props> = ({
  post,
  className,
  chartTheme,
  chartHeight = 120,
  nonInteractive = false,
}) => {
  const [cursorValue, setCursorValue] = useState<number | null>(null);

  const renderChart = () => {
    if (post.group_of_questions) {
      const { questions } = post.group_of_questions;
      const groupType = questions.at(0)?.type;

      if (!groupType) {
        return null;
      }

      switch (groupType) {
        case QuestionType.Numeric:
        case QuestionType.Date: {
          const predictionQuestion = getFanOptionsFromNumericGroup(
            questions as QuestionWithNumericForecasts[]
          );
          return (
            <FanChart
              options={predictionQuestion}
              height={chartHeight}
              withTooltip={!nonInteractive}
            />
          );
        }
        case QuestionType.Binary:
          const visibleChoicesCount = 3;
          const timestamps = getGroupQuestionsTimestamps(
            questions as QuestionWithNumericForecasts[]
          );
          const choices = generateChoiceItemsFromBinaryGroup(
            questions as QuestionWithNumericForecasts[],
            { activeCount: visibleChoicesCount, sortPredictionDesc: true }
          );
          return (
            <MultipleChoiceTile
              choices={choices}
              timestamps={timestamps}
              visibleChoicesCount={visibleChoicesCount}
              chartHeight={chartHeight}
              chartTheme={chartTheme}
            />
          );
        default:
          return null;
      }
    }

    if (post.conditional) {
      return (
        <ConditionalTile
          conditional={post.conditional}
          curationStatus={post.curation_status}
        />
      );
    }

    if (post.question) {
      const { question } = post;

      switch (question.type) {
        case QuestionType.Binary:
        case QuestionType.Numeric:
        case QuestionType.Date:
          return (
            <NumericChart
              dataset={question.forecasts}
              height={chartHeight}
              type={getNumericChartTypeFromQuestion(question.type)}
              onCursorChange={nonInteractive ? undefined : setCursorValue}
              extraTheme={chartTheme}
            />
          );
        case QuestionType.MultipleChoice:
          const visibleChoicesCount = 3;
          const choices = generateChoiceItemsFromMultipleChoiceForecast(
            question.forecasts,
            { activeCount: visibleChoicesCount }
          );
          return (
            <MultipleChoiceTile
              choices={choices}
              timestamps={question.forecasts.timestamps}
              visibleChoicesCount={visibleChoicesCount}
              chartHeight={chartHeight}
              chartTheme={chartTheme}
            />
          );
        default:
          return null;
      }
    }

    return null;
  };

  const renderPrediction = () => {
    if (post.question) {
      const { question } = post;
      switch (question.type) {
        case QuestionType.Binary:
        case QuestionType.Numeric:
        case QuestionType.Date: {
          const cursorIndex = cursorValue
            ? question.forecasts.timestamps.findIndex((t) => t === cursorValue)
            : null;

          const prediction =
            cursorIndex !== null && cursorIndex !== -1
              ? question.forecasts.values_mean[cursorIndex]
              : question.forecasts.values_mean.at(-1) ?? undefined;

          return (
            <PredictionChip
              questionType={question.type}
              status={post.curation_status}
              prediction={prediction}
              resolution={question.resolution}
            />
          );
        }
        default:
          return null;
      }
    }

    return null;
  };

  return (
    <Link
      href={`/questions/${post.id}`}
      className={classNames(
        "flex w-full min-w-0 flex-col gap-3 bg-gray-0 p-5 no-underline hover:shadow-lg active:shadow-md dark:bg-gray-0-dark xs:rounded-md",
        className
      )}
    >
      <div className="flex items-start justify-between max-[288px]:flex-col">
        {!post.conditional && (
          <h2 className="ForecastTitle m-0 line-clamp-2 text-lg font-medium leading-snug tracking-normal">
            {post.title}
          </h2>
        )}
        {renderPrediction()}
      </div>
      <div
        className={classNames(
          "flex size-full min-h-[120px] min-w-0 items-start"
        )}
      >
        {renderChart()}
      </div>
    </Link>
  );
};

export default ForecastCard;

import { FC } from "react";

import FanChart from "@/components/charts/fan_chart";
import MultipleChoiceChart from "@/components/charts/multiple_choice_chart";
import NumericChart from "@/components/charts/numeric_chart";
import ConditionalTile from "@/components/conditional_tile";
import { PostWithForecasts } from "@/types/post";
import { QuestionType, QuestionWithNumericForecasts } from "@/types/question";
import {
  generateChoiceItemsFromBinaryGroup,
  generateChoiceItemsFromMultipleChoiceForecast,
  getFanOptionsFromNumericGroup,
  getGroupQuestionsTimestamps,
} from "@/utils/charts";

const CHART_HEIGHT = 150;

type Props = {
  postData: PostWithForecasts;
};

const EmbeddedQuestionCard: FC<Props> = ({ postData }) => {
  const renderChart = () => {
    const { question, group_of_questions, conditional } = postData;

    if (conditional) {
      return (
        <div className="p-3">
          <ConditionalTile
            conditional={conditional}
            curationStatus={postData.curation_status}
          />
        </div>
      );
    }

    if (group_of_questions) {
      const { questions } = group_of_questions;

      const groupType = questions.at(0)?.type;
      if (!groupType) {
        return null;
      }

      switch (groupType) {
        case QuestionType.Binary: {
          const timestamps = getGroupQuestionsTimestamps(
            questions as QuestionWithNumericForecasts[]
          );
          const choices = generateChoiceItemsFromBinaryGroup(
            questions as QuestionWithNumericForecasts[],
            { activeCount: 3 }
          );

          return (
            <MultipleChoiceChart
              timestamps={timestamps}
              choiceItems={choices}
              height={CHART_HEIGHT}
            />
          );
        }
        case QuestionType.Numeric:
        case QuestionType.Date:
          return (
            <FanChart
              options={getFanOptionsFromNumericGroup(
                questions as QuestionWithNumericForecasts[]
              )}
              height={CHART_HEIGHT}
            />
          );
        default:
          return null;
      }
    }

    if (question) {
      switch (question.type) {
        case QuestionType.Numeric:
        case QuestionType.Date:
        case QuestionType.Binary:
          return (
            <NumericChart
              dataset={question.forecasts}
              type={question.type}
              height={CHART_HEIGHT}
            />
          );
        case QuestionType.MultipleChoice:
          return (
            <MultipleChoiceChart
              timestamps={question.forecasts.timestamps}
              choiceItems={generateChoiceItemsFromMultipleChoiceForecast(
                question.forecasts,
                { activeCount: 3 }
              )}
              height={CHART_HEIGHT}
            />
          );
        default:
          return null;
      }
    }
  };

  return (
    <div className="mx-auto w-[400px] bg-blue-200 p-3 text-sm dark:bg-blue-200-dark">
      {!postData.conditional && <h4 className="mb-2 mt-0">{postData.title}</h4>}
      <div className="bg-gray-0 dark:bg-gray-0-dark">{renderChart()}</div>
    </div>
  );
};

export default EmbeddedQuestionCard;
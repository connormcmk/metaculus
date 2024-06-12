"use client";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { round } from "lodash";
import { useTranslations } from "next-intl";
import { FC, useCallback, useMemo, useState } from "react";

import { createForecast } from "@/app/(main)/questions/actions";
import ChoiceIcon from "@/components/choice_icon";
import ForecastChoiceInput from "@/components/forecast_maker/forecast_choice_input";
import Button from "@/components/ui/button";
import { FormError } from "@/components/ui/form_field";
import { METAC_COLORS, MULTIPLE_CHOICE_COLOR_SCALE } from "@/constants/colors";
import { useAuth } from "@/contexts/auth_context";
import { useModal } from "@/contexts/modal_context";
import { ErrorResponse } from "@/types/fetch";
import {
  MultipleChoiceForecast,
  QuestionWithMultipleChoiceForecasts,
} from "@/types/question";

const PREDICTION_PRECISION = 3;
const MIN_VALUE = 10 ** -PREDICTION_PRECISION * 100;
const MAX_VALUE = 100 - MIN_VALUE;
const MIN_PREDICTION = 10 ** -PREDICTION_PRECISION;

type ChoiceOption = {
  name: string;
  communityForecast: number | null;
  forecast: number | null;
  color: {
    DEFAULT: string;
    dark: string;
  };
};

type Props = {
  question: QuestionWithMultipleChoiceForecasts;
};

const ForecastMakerMultipleChoice: FC<Props> = ({ question }) => {
  const t = useTranslations();
  const { user } = useAuth();
  const { setCurrentModal } = useModal();

  const [isDirty, setIsDirty] = useState(false);
  const [choicesForecasts, setChoicesForecasts] = useState<ChoiceOption[]>(
    generateChoiceOptions(question.forecasts)
  );
  const forecastsSum = useMemo(
    () => sumForecasts(choicesForecasts),
    [choicesForecasts]
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<ErrorResponse>();

  const initialForecast = useMemo(
    () => roundForecast(100 / choicesForecasts.length),
    [choicesForecasts.length]
  );

  const resetForecasts = useCallback(() => {
    setChoicesForecasts((prev) =>
      prev.map((prevChoice) => ({
        ...prevChoice,
        forecast: initialForecast,
      }))
    );
  }, [initialForecast]);
  const handleForecastChange = useCallback(
    (choice: string, value: number) => {
      setIsDirty(true);
      setChoicesForecasts((prev) =>
        prev.map((prevChoice) => {
          const isInitialChange = prev.some((el) => el.forecast === null);

          if (isInitialChange) {
            return { ...prevChoice, forecast: initialForecast };
          }

          if (prevChoice.name === choice) {
            return { ...prevChoice, forecast: value };
          }

          return prevChoice;
        })
      );
    },
    [initialForecast]
  );

  const areForecastsValid = useMemo(
    () =>
      choicesForecasts.every((el) => el.forecast !== null) &&
      forecastsSum === 100,
    [choicesForecasts, forecastsSum]
  );
  const submitIsAllowed = !isSubmitting && isDirty && areForecastsValid;
  const handlePredictSubmit = async () => {
    setSubmitError(undefined);

    if (!user) {
      setCurrentModal({ type: "signup" });
      return;
    }

    if (!areForecastsValid) return;

    const forecastValue = choicesForecasts.map((el) =>
      round(el.forecast! / 100, PREDICTION_PRECISION)
    );

    setIsSubmitting(true);
    const response = await createForecast(
      question.id,
      {
        continuousCdf: null,
        probabilityYes: null,
        probabilityYesPerCategory: forecastValue,
      },
      forecastValue
    );
    if ("errors" in response) {
      setSubmitError(response.errors);
    }
    setIsSubmitting(false);
  };

  return (
    <section className="bg-blue-200 p-3 dark:bg-blue-200-dark">
      <h3 className="m-0 text-base font-normal leading-5">
        {t("MakePrediction")}
      </h3>
      <table className="mt-3 border-separate rounded border border-gray-300 bg-gray-0 dark:border-gray-300-dark dark:bg-gray-0-dark">
        <thead>
          <tr>
            <th className="bg-blue-100 p-2 text-left text-xs font-bold dark:bg-blue-100-dark">
              {t("Candidates")}
            </th>
            <th className="bg-blue-100 p-2 pr-4 text-right text-xs dark:bg-blue-100-dark">
              <FontAwesomeIcon
                icon={faUserGroup}
                size="sm"
                className="align-middle text-olive-700 dark:text-olive-700-dark"
              />
            </th>
            <th
              className="hidden bg-blue-100 p-2 text-left text-xs font-bold text-orange-800 dark:bg-blue-100-dark dark:text-orange-800-dark sm:table-cell"
              colSpan={2}
            >
              My Prediction
            </th>
            <th className="bg-blue-100 p-2 text-center text-xs font-bold text-orange-800 dark:bg-blue-100-dark dark:text-orange-800-dark sm:hidden">
              Me
            </th>
          </tr>
        </thead>
        <tbody>
          {choicesForecasts.map((choice) => (
            <tr key={choice.name}>
              <th className="w-full border-t border-gray-300 p-2 text-left text-sm font-bold leading-6 dark:border-gray-300-dark sm:w-auto sm:min-w-[10rem] sm:text-base">
                <div className="flex gap-2">
                  <ChoiceIcon className="mt-1 shrink-0" color={choice.color} />
                  {choice.name}
                </div>
              </th>
              <ForecastChoiceInput
                forecastValue={choice.forecast}
                defaultSliderValue={initialForecast}
                choiceName={choice.name}
                communityForecast={choice.communityForecast}
                min={MIN_VALUE}
                max={MAX_VALUE}
                onChange={handleForecastChange}
              />
            </tr>
          ))}
        </tbody>
      </table>

      <div className="my-5 flex flex-wrap items-center justify-center gap-4 border-b border-b-blue-400 pb-5 dark:border-b-blue-400-dark">
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant="secondary"
            type="reset"
            onClick={resetForecasts}
            disabled={!isDirty}
          >
            Discard Changes
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={!submitIsAllowed}
            onClick={handlePredictSubmit}
          >
            {user ? t("saveButton") : t("signUpButton")}
          </Button>
        </div>
        <FormError errors={submitError} />
      </div>
    </section>
  );
};

function generateChoiceOptions(
  dataset: MultipleChoiceForecast
): ChoiceOption[] {
  const { timestamps, nr_forecasters, my_forecasts, ...choices } = dataset;
  return Object.entries(choices).map(([choice, values], index) => ({
    name: choice,
    color: MULTIPLE_CHOICE_COLOR_SCALE[index] ?? METAC_COLORS.gray["400"],
    communityForecast: values.at(-1)?.value_mean ?? null,
    forecast: null,
  }));
}

function sumForecasts(predictions: ChoiceOption[]) {
  return predictions.reduce((acc, { forecast }) => acc + Number(forecast), 0);
}

function roundForecast(value: number) {
  return round(value, MIN_PREDICTION);
}

export default ForecastMakerMultipleChoice;

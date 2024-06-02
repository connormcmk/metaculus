"use client";
import { useTranslations } from "next-intl";
import { FC, useEffect, useMemo, useState } from "react";

import { QUESTION_TYPE_LABEL_MAP } from "@/app/questions/constants/filters";
import { TEXT_SEARCH_FILTER } from "@/app/questions/constants/query_params";
import PopoverFilter from "@/components/popover_filter";
import { FilterOptionType } from "@/components/popover_filter/types";
import SearchInput from "@/components/search_input";
import useDebounce from "@/hooks/use_debounce";
import useSearchParams from "@/hooks/use_search_params";
import { QuestionType } from "@/types/question";

const QuestionFilters: FC = () => {
  const t = useTranslations();
  const { setParam, deleteParam } = useSearchParams();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  useEffect(() => {
    if (debouncedSearch) {
      setParam(TEXT_SEARCH_FILTER, debouncedSearch);
    } else {
      deleteParam(TEXT_SEARCH_FILTER);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);
  const eraseSearch = () => {
    setSearch("");
    deleteParam(TEXT_SEARCH_FILTER);
  };

  // TODO: connect with search params, integrate with BE
  const popoverFilters = useMemo(
    () => [
      {
        id: "question_type",
        title: "Question Type",
        type: FilterOptionType.MultiChip,
        options: Object.values(QuestionType).map((type) => ({
          label: QUESTION_TYPE_LABEL_MAP[type],
          value: type,
          active: false,
        })),
      },
    ],
    []
  );
  const handlePopOverFilterChange = (
    filterId: string,
    optionValue: string | string[]
  ) => {};

  return (
    <div>
      <div className="block">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onErase={eraseSearch}
          placeholder={t("questionSearchPlaceholder")}
        />
        <div className="mx-0 my-3 flex flex-wrap justify-end gap-2">
          <PopoverFilter
            filters={popoverFilters}
            onChange={handlePopOverFilterChange}
            panelClassName="w-[500px]"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionFilters;

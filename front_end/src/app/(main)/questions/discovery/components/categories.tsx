import { useTranslations } from "next-intl";
import { FC } from "react";

import Chip from "@/components/ui/chip";
import { QUESTION_CATEGORIES_FILTER } from "@/constants/questions_feed";
import { Category } from "@/types/projects";

import DiscoverySection from "./section";

type Props = {
  categories: Category[];
};

const CategoriesDiscovery: FC<Props> = ({ categories }) => {
  const t = useTranslations();

  const categoriesToDisplay = categories
    .filter((c) => !!c.questions_count)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <DiscoverySection title={t("categories")}>
      <div className="flex flex-wrap justify-start gap-x-2.5 gap-y-3 self-stretch">
        {categoriesToDisplay.map((category) => (
          <Chip
            key={category.id}
            href={`/questions/?${QUESTION_CATEGORIES_FILTER}=${category.slug}`}
            color="olive"
            size="sm"
          >
            {category.name}
          </Chip>
        ))}
      </div>
    </DiscoverySection>
  );
};

export default CategoriesDiscovery;

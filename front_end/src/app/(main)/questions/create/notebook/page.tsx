/* eslint-disable */
"use client";

import dynamic from "next/dynamic";

const MarkdownEditor = dynamic(() => import("@/components/markdown_editor"), {
  ssr: false,
});

import { useState } from "react";
import Button from "@/components/ui/button";
import { createQuestionPost } from "../../actions";
import { useTranslations } from "next-intl";
import ProjectsApi from "@/services/projects";
import { useRouter } from "next/navigation";

const NotebookCreator: React.FC = ({}) => {
  const [markdown, setMarkdown] = useState("");
  const [title, setTitle] = useState("");
  const t = useTranslations();
  // @TODO Separate notebook editor client
  // const allCategories = await ProjectsApi.getCategories();
  const router = useRouter();

  return (
    <div className="h-50vh mx-auto mb-8 mt-4 max-w-3xl overflow-auto rounded-lg bg-gray-0 p-6 dark:bg-gray-100-dark">
      <input
        className="mb-4 p-1 pl-2 text-xl"
        type="text"
        placeholder={t("Title")}
        onChange={(e) => setTitle(e.target.value)}
      ></input>
      <div className="pl-2">
        <MarkdownEditor
          markdown={markdown}
          onChange={setMarkdown}
          mode="write"
        />
      </div>
      <div className="pl-2">
        <Button
          className="text-xl"
          onClick={async () => {
            const resp = await createQuestionPost({
              title: title,
              notebook: {
                type: "discussion",
                image_url: null,
                markdown: markdown,
              },
            });
            router.push(`/questions/${resp?.post?.id}`);
          }}
        >
          Create Notebook
        </Button>
      </div>
    </div>
  );
};

export default NotebookCreator;

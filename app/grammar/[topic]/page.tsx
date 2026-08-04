import { grammarExercises } from "@/lib/data";
import { verbTenseTopics } from "@/lib/curriculum/verbs";
import { VerbTopicView } from "@/components/verbs/verb-topic-view";

export function generateStaticParams() {
  return verbTenseTopics.map((topic) => ({ topic: topic.slug }));
}

export default async function GrammarTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic: slug } = await params;
  const topic = verbTenseTopics.find((item) => item.slug === slug) ?? verbTenseTopics[0];
  const exercises = grammarExercises.filter((exercise) =>
    exercise.tags.includes(topic.slug),
  );
  return <VerbTopicView topic={topic} exercises={exercises} />;
}

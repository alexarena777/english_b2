import { ExamRunPageClient } from "@/components/exams/exam-run-client";

export function generateStaticParams() {
  return [{ id: "short-1" }, { id: "full-1" }];
}

export default async function ExamRunPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ExamRunPageClient id={id} />;
}

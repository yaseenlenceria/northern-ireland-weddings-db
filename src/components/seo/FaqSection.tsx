import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JsonLd } from "@/components/site/JsonLd";
import { faqSchema, type FaqInput } from "@/lib/seo";

export function FaqSection({
  faqs,
  title = "Frequently asked questions",
  withSchema = false,
}: {
  faqs: FaqInput[];
  title?: string;
  withSchema?: boolean;
}) {
  return (
    <>
      {withSchema ? <JsonLd data={faqSchema(faqs)} /> : null}
      <h2 className="text-2xl leading-tight sm:text-3xl">{title}</h2>
      <Accordion type="single" collapsible className="mt-6">
        {faqs.map((faq, index) => (
          <AccordionItem key={faq.question} value={`item-${index}`}>
            <AccordionTrigger className="text-left text-base font-medium">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="leading-relaxed text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}

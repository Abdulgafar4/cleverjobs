
import { Button } from "@/components/ui/button";

// Fix the Button usage in CompanyProfile by using an anchor element
const applyButton = (
  <Button variant="default" asChild>
    <a href="/apply-url" target="_blank" rel="noopener noreferrer">
      Apply Now
    </a>
  </Button>
);

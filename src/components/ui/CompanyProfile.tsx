
import { Button } from "@/components/ui/button";

// ... fix the Button usage in CompanyProfile to remove 'as' prop
const applyButton = (
  <Button variant="default" href={job.applyUrl} target="_blank" rel="noopener noreferrer">
    Apply Now
  </Button>
);

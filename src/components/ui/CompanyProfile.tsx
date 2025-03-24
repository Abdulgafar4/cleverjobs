
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Fix the Button usage in CompanyProfile by using proper Link integration
const applyButton = (
  <Button variant="default" asChild>
    <Link to="/apply-url" target="_blank" rel="noopener noreferrer">
      Apply Now
    </Link>
  </Button>
);

export { applyButton };

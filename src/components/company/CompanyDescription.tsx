
interface CompanyDescriptionProps {
  name: string;
  description: string;
}

const CompanyDescription = ({ name, description }: CompanyDescriptionProps) => {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 mb-8">
      <h2 className="text-xl font-medium mb-4">About {name}</h2>
      <div className="prose max-w-none">
        <p className="text-foreground/90 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default CompanyDescription;

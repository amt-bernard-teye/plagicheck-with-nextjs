import Button from "@/components/atoms/button";
import SubHeader from "@/components/molecules/sub-header";
import PageHeader from "@/components/organisms/page-header";

export default function AcademicDivision() {
  return (
    <>
      <PageHeader />
      <SubHeader 
        title="Academic Unit"
        description="Add faculties and departments here">
        <div className="flex gap-4">
            <div className="flex flex-col w-[162px]">
              <Button el="button" variant="secondary">Add Department</Button>
            </div>
            <div className="flex flex-col w-[128px]">
              <Button el="button" variant="primary">Add Faculty</Button>
            </div>
          </div>
      </SubHeader>
    </>
  );
}
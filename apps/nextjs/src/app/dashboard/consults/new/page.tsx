import NewConsultForm from "~/app/_components/consults/new-consult-form";
import NewConsultHeader from "~/app/_components/consults/new-consult-header";
import SafeArea from "~/app/_components/layout/safe-area";

const NewConsultPage = () => {
  return (
    <SafeArea>
      <NewConsultHeader />
      <div className="mx-auto flex h-full max-w-screen-xl flex-row items-center justify-center md:p-4">
        <NewConsultForm />
      </div>
    </SafeArea>
  );
};

export default NewConsultPage;

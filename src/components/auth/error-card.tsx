import CardWrapper from "./card-wrapper";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export function ErrorCard() {
  return (
    <CardWrapper
      headerLabel="Ooops! Something went wrong!"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
      showSocial={false}
    >
      <div className="w-full items-center flex justify-center">
        <ExclamationTriangleIcon
          className="text-destructive"
          width={30}
          height={30}
        />
      </div>
    </CardWrapper>
  );
}

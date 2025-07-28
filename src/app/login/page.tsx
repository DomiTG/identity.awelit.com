import { getClientById, listClients } from "@/server/facades/clients.facade";
import { notFound } from "next/navigation";
import IClient from "../interfaces/IClient";
import Image from "next/image";
import LoginForm from "../components/LoginForm";
import ErrorDisplay from "../components/ErrorDisplay";

export async function generateStaticParams() {
  const clients = await listClients();
  return clients.map((client) => ({
    client_id: client.client_id,
  }));
}

const isValidRedirectUri = (uri: string, client: IClient): boolean => {
  return client.redirect_uris.includes(uri);
};
type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props) {
  const { client_id } = await searchParams;
  const client = await getClientById(client_id as string);
  if (!client) {
    return {};
  }
  return {
    title: `Login - ${client.name}`,
    description:
      client.description ||
      "Register to access the secure identity management platform.",
  };
}

export default async function LoginPage({ searchParams }: Props) {
  const { client_id, redirect_uri } = await searchParams;
  if (!client_id) {
    notFound();
  }
  if (!redirect_uri) {
    return (
      <ErrorDisplay
        title="Missing Parameter"
        message="The redirect URI parameter is required to continue."
      />
    );
  }
  const client = await getClientById(client_id as string);
  if (!client) {
    notFound();
  }
  if (!isValidRedirectUri(redirect_uri as string, client)) {
    return (
      <ErrorDisplay
        title="Invalid Redirect URI"
        message="The provided redirect URI is not allowed for this client."
      />
    );
  }

  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-br from-blue-500 to-blue-600 min-h-screen h-full">
      <div className="p-6 md:p-8 lg:p-12 flex flex-col justify-between flex-1 backdrop-blur-sm bg-black/20 md:bg-black/5">
        <div className="flex items-center space-x-2">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase text-white">
              AWELIT
            </h1>
            <p className="text-white text-xs md:text-sm mt-1 opacity-90">
              Where the future of authentication begins
            </p>
          </div>
        </div>

        <div className="md:hidden text-center my-4 px-4">
          <h2 className="text-xl font-bold text-white leading-tight uppercase">
            {client.title || "Secure Identity Management"}
          </h2>
          <p className="text-white text-sm mt-2 opacity-90">
            {client.description
              ? client.description.split(" ").slice(0, 12).join(" ") +
                (client.description.split(" ").length > 12 ? "..." : "")
              : "Modern identity platform for your applications."}
          </p>
        </div>
        <div className="hidden md:block my-8 px-10 max-w-2xl">
          <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white leading-tight uppercase">
            {client.title ||
              "Secure Identity Management for Modern Applications"}
          </h2>
          <p className="text-white text-lg mt-6 opacity-80">
            {client.description ||
              "Seamlessly integrate authentication and authorization for your applications with our modern identity platform."}
          </p>
          <div className="mt-6 relative h-64 lg:h-80 w-full">
            <Image
              src="/tl.webp"
              alt="Security Illustration"
              fill
              className="object-contain w-full"
              priority
            />
          </div>
        </div>

        <div className="hidden md:flex flex-col lg:flex-row items-center space-x-4 text-white text-sm">
          <span>
            Powered by <strong>AWELIT</strong>
          </span>
          <span>
            &copy; {new Date().getFullYear()} AWELIT. All rights reserved.
          </span>
          <a href="#" className="hover:underline transition-all">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline transition-all">
            Terms of Service
          </a>
        </div>
      </div>

      <div className="bg-white shadow-2xl rounded-t-3xl md:rounded-t-none md:rounded-l-3xl flex flex-col justify-center items-center w-full md:w-[60%] lg:w-[50%] p-6 md:p-8 lg:p-12">
        <LoginForm client={client} redirectUri={redirect_uri as string} />

        <div className="mt-8 md:hidden text-center text-gray-500 text-xs flex flex-col space-y-2">
          <span>
            Powered by{" "}
            <span className="font-semibold text-indigo-600">AWELIT</span>
          </span>
          <span>
            &copy; {new Date().getFullYear()} AWELIT. All rights reserved.
          </span>
          <div className="flex justify-center space-x-4">
            <a href="#" className="hover:text-indigo-500 transition-all">
              Privacy
            </a>
            <a href="#" className="hover:text-indigo-500 transition-all">
              Terms
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

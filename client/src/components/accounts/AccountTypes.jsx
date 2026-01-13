import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, User } from "lucide-react";
const AccountTypes = () => {
  return (
    <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-6">
      <TabsTrigger
        value="personal"
        className="data-[state=active]:bg-secondary data-[state=active]:text-white"
      >
        <User className="mr-2 h-4 w-4" /> Personal
      </TabsTrigger>
      <TabsTrigger
        value="company"
        className="data-[state=active]:bg-primary data-[state=active]:text-white"
      >
        <Briefcase className="mr-2 h-4 w-4" /> Company
      </TabsTrigger>
    </TabsList>
  );
};

export default AccountTypes;

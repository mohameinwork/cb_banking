import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
const BalanceCards = ({ title, type, amount, dueDate, icon: Icon }) => {
  return (
    <Card className="border-t-4 border-t-secondary shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon ? (
          <Icon className="h-4 w-4 text-secondary" />
        ) : (
          <span className="text-sm font-bold text-primary">sh</span>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{amount}</div>
        {type === "USD" && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center">
            <TrendingUp className="h-3 w-3 text-emerald-500 mr-1" />
            <span className="text-emerald-500 font-medium">+2.5%</span> from
            last month
          </p>
        )}
        {type === "Loan" && (
          <p className="text-xs text-muted-foreground mt-1">Due: {dueDate}</p>
        )}

        {type === "income" && (
          <p className="text-xs text-muted-foreground mt-1">
            From Sarif & Transfers
          </p>
        )}

        {type === "SLSH" && (
          <p className="text-xs text-muted-foreground mt-1">
            Available to Exchange
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default BalanceCards;

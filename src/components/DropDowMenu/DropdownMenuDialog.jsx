import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

 function DropdownMenuDialog({appId , updateStatus}) {
   return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon-sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-36" align="end">

        <DropdownMenuItem onSelect={() => updateStatus(appId, "accepted")}>
          Accept
        </DropdownMenuItem>

        {/* <DropdownMenuItem onSelect={() => updateStatus(appId, "pending")}> */}
          {/* Pending */}
        {/* </DropdownMenuItem> */}

        <DropdownMenuItem onSelect={() => updateStatus(appId, "rejected")}>
          Reject
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DropdownMenuDialog;
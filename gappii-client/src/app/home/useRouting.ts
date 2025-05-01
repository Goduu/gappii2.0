import { redirect } from "next/navigation";
import { MenuOption } from "./menuOptionsList";

export default function useRouting(selectedOptions: MenuOption) {

    const handleRouteClick = (option: MenuOption) => {
        if (option === "continue") {
            redirect("/resume")
        }
    }

    if (selectedOptions.at(-1) === "resume-last-session") {
        redirect("/resume")
    }

    return { handleRouteClick }

}
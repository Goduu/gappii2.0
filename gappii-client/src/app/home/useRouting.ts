import { redirect } from "next/navigation";
import { Route } from "./menuOptionsList";

export default function useRouting(selectedOptions: Route) {

    const handleRouteClick = (option: Route) => {
        if (option === "session/continue") {
            redirect("/resume")
        }
    }

    if (selectedOptions.at(-1) === "resume-last-session") {
        redirect("/resume")
    }

    return { handleRouteClick }

}
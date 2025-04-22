import { redirect } from "next/navigation";
import { Title } from "./menuOptionsList";

export default function useRouting(selectedOptions: Title[]) {

    if (selectedOptions.at(-1) === "resume-last-session") {
        redirect("/resume")
    }

}
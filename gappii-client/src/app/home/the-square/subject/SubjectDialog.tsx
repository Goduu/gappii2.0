import { BorderBeam } from "@/components/magicui/border-beam";
import {
    Card,
    CardContent
} from "@/components/ui/card";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { SubjectDetailsCard } from "./SubjectDetailsCards";


type SubjectDialogProps = {
    subject: string;
    topics: string[];
    index: number;
}

export const SubjectDialog = ({ subject, topics, index }: SubjectDialogProps) => {
    return (
        <Dialog>
            <DialogTrigger onClick={(e) => e.stopPropagation()}>
                <Card
                    className="relative bg-inherit text-white w-40 border-teal-800 cursor-pointer"
                >
                    <CardContent>
                        <div className="text-sm font-black">
                            {subject}
                        </div>
                        <div className="text-xs flex gap-1 truncate text-ellipsis">
                            {topics.join(", ")}
                        </div>
                    </CardContent>
                    <BorderBeam delay={index * 0.5} />
                </Card></DialogTrigger>
            <DialogContent className="bg-transparent border-none">
                <DialogTitle hidden>{subject}</DialogTitle>
                <SubjectDetailsCard subject={subject} topics={topics} likes={0} />
            </DialogContent>
        </Dialog>
    )
}

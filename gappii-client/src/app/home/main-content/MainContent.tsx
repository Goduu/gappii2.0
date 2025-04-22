import { Title } from "../menuOptionsList"
import TopicSearch from "./TopicSearch"
import SelectedOptions from "./SelectedOptions"

type SelectedOptionsProps = {
    selectedOptions: Title[],
    onCategoryClick: (category: Title) => void,
    textInput: string
}

export default function MainContent({ selectedOptions, onCategoryClick, textInput }: SelectedOptionsProps) {

    // Check if the last selected option is "change-topic"
    const lastOption = selectedOptions.at(-1);
    const isChangingTopic = lastOption === "change-topic";

    // Handler for when a topic is selected from the topic search
    const handleTopicSelect = (topicId: string) => {
        // You can adapt this based on your app's requirements
        // For example, you might want to clear the "change-topic" option first
        onCategoryClick("initial"); // Reset to initial state

        // Then handle the topic selection
        console.log(`Selected topic: ${topicId}`);
        // Additional logic for topic selection
    };

    return (
        <div className="flex items-center justify-center relative w-full flex-col gap-2">
            {isChangingTopic ? (
                <TopicSearch
                    textInput={textInput}
                    onSelectTopic={handleTopicSelect}
                />
            ) : (
                <SelectedOptions
                    selectedOptions={selectedOptions}
                    onCategoryClick={onCategoryClick}
                />
            )}
        </div>
    )
}
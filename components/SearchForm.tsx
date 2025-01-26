import Form from "next/form"; // it is a new form tag from next js. this forms will update URL search params.
import SearchFormReset from "@/components/SearchFormReset";
import {Search} from "lucide-react";

const SearchForm = ({ query }: { query?: string }) => {
    return (
        // when user click the submit button the form will update the URL search params with ?query=<user_input_value>
        <Form action="/" scroll={false} className="search-form">
            <input
                name="query"
                defaultValue={query}
                className="search-input"
                placeholder="Search Startups"
            />

            <div className="flex gap-2">
                {/* since our form is server compo and we need button with click event (so that has to be client compo) to reset the from. lets make separate compo for reset button */}
                {query && <SearchFormReset />}

                <button type="submit" className="search-btn text-white">
                    <Search className="size-5" />
                </button>
            </div>
        </Form>
    )
}

export default SearchForm

# Second Home

## Pitch
Somewhere new. Something you. Second Home helps newcomers discover three places in an unfamiliar city by starting with the music, films, books, brands, and places they already love.

## What it does
Choose your destination and three to five favourites. Second Home resolves those favourites to Qloo entities, retrieves place recommendations in the selected locality, and presents three discoveries with cultural taste connections and map links. Ask for an alternative, a quieter atmosphere, a cheaper option, or a place closer to the city centre. The tool retrieves alternatives while retaining your original tastes and the discoveries you want to keep.

## Why Qloo matters
Qloo supplies both the actual place candidates and the cultural affinity evidence. This is not an LLM-written city list. The same destination can yield different discoveries for different taste profiles. Explanations cite the input tastes present in Qloo's contribution metadata, and missing facts are marked unknown.

## Agent workflow
Resolve entities → retrieve locality-filtered Insights → evaluate available metadata → select distinct discoveries → explain retrieved evidence → retrieve and compare alternatives after feedback. This version uses bounded deterministic orchestration rather than an LLM.

## Built with
React, TypeScript, Vinext, Cloudflare Worker-compatible Sites hosting, and Qloo Search/Insights APIs.

## Testing instructions
Search for London, select the United Kingdom match, and add three favourites such as Radiohead (artist), Spirited Away (movie), and Nike (brand). Select explicit matches. Find discoveries, open a map link, and try a replacement. Repeat with a different taste profile to compare the recommendations. Live responses depend on Qloo coverage and availability.

## Before submission
- Verify a live URL is reachable anonymously and working end to end.
- Publish the source repository, including LICENSE and setup instructions.
- Confirm quota protections and current API access.
- Update this description if final functionality changes.

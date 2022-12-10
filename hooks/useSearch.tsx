import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';

import { graphQLClientForFrontend } from '../graphql';

export interface ISearchRequest {
  searchTerm: string;
}

export interface ISearchResponse {
  isSuccess: boolean;
  message: string;
  searchResult: string;
}

function useSearch({ searchTerm }: ISearchRequest) {
  const variables = {
    searchTerm,
  };

  const query = gql`
    query Search(
      $searchTerm: String!
    ) {
      search(
        input: {
            searchTerm: $searchTerm
        }
      ) {
        message
        isSuccess
        searchResult
      }
    }
  `;

  return useQuery<ISearchResponse>(
    ['search', searchTerm],
    async () => {
      const data = await graphQLClientForFrontend.request(query, variables);
      return data.search;
    },
    {
      retry: false,
      enabled: false,
      staleTime: 0,
      cacheTime: 0
    }
  );
}

export default useSearch;

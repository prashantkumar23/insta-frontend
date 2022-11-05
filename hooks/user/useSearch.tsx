import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';

import { graphQLClient } from '../../graphql';

export interface ISearch {
  searchTerm: string;
}

function useSearch({ searchTerm }: ISearch) {
  const variables = {
    searchTerm
  };

  const query = gql`
    query search( $searchTerm: String!) {
      search(input: {  searchTerm: $searchTerm }) {
        message
        isSuccess
      }
    }
  `;

  return useQuery(
    ['search', searchTerm],
    async () => {
      const data = await graphQLClient.request(query, variables);
      return data;
    },
    {
        enabled: false,
      retry: false,
    }
  );
}

export default useSearch;

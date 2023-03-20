import styled from "styled-components";
import { useState, useEffect, useMemo } from "react";
import { MagnifyingGlass, Info } from "phosphor-react";
import colors from "../../theme/colors";
import { Shard, ShardGroup } from "../SismoReactIcon";
import axios from "axios";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 654px;
  margin-bottom: 30px;
`;

const Label = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 18px;
  line-height: 21px;
  font-family: ${props => props.theme.fonts.bold};
  color: ${props => props.theme.colors.white};
`;

const SearchInputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInput = styled.input`
  font-size: 14px;
  line-height: 20px;
  padding: 0px 10px 0px 35px;
  background-color: #fef3f7;

  border: 1px solid ${props => props.theme.colors.blue9};
  border-radius: 5px;
  width: 100%;
  height: 40px;

  color: ${props => props.theme.colors.blue9};

  :focus {
    outline: none;
  }
  ::placeholder {
    font-family: ${props => props.theme.regular};
    font-size: 14px;
    line-height: 20px;
    font-style: italic;
    color: #959aab;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: calc(50% - 9px);
  left: 10px;
  pointer-events: none;
  width: 18px;
  height: 18px;
`;

const SearchResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 6px 10px;
  background-color: #f2adba;
  border-radius: 5px;
  height: 150px;
  border: 0.5px solid #2a3557;
  overflow-y: scroll;
`;

const SearchResultItem = styled.a`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  line-height: 20px;
  font-family: ${props => props.theme.fonts.regular};
  color: ${props => props.theme.colors.blue10};
  text-decoration: none;
`;

export default function Search(): JSX.Element {
  const [isFocused, setIsFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [eligibleAccounts, setEligibleAccounts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(event.target.value);
  }

  useEffect(() => {
    function convertObjectToStringArray(object: Object) {
      const stringArray = [];
      for (const key in object) {
        stringArray.push(key);
      }
      return stringArray;
    }

    async function getEligibleAccounts(groupName: string) {
      try {
        setLoading(true);
        setError("");
        const latestGroups = await axios.get(
          `${process.env.NEXT_PUBLIC_SISMO_HUB_URL}/groups/latests`
        );
        const group = latestGroups.data.items.find(
          (group: any) => group.name === groupName
        );
        const response = await axios.get(group.dataUrl);
        const _eligibleAccounts = convertObjectToStringArray(response.data);

        setEligibleAccounts(_eligibleAccounts);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("no group found");
      }
    }

    getEligibleAccounts("the-merge-contributor");
  }, []);

  function search(dataSet: string[], searchValue: string) {
    if (!dataSet) return;
    if (!searchValue) return dataSet;

    const lowerCaseSearchValue = searchValue.toLowerCase().trim();
    const searchResult = dataSet.filter(item => {
      if (item.toLowerCase().includes(lowerCaseSearchValue)) return item;
    });

    return searchResult;
  }

  const searchedAccounts = useMemo(() => {
    if (searchValue.length > 1 && eligibleAccounts.length > 0) {
      const _searchedAccounts = search(eligibleAccounts, searchValue);
      return _searchedAccounts;
    } else {
      return eligibleAccounts;
    }
  }, [eligibleAccounts, searchValue]);

  return (
    <>
      <Container>
        <Label>
          <ShardGroup size={24} color={"white"} strokeWidth={2.2} />

          Are you a contributor to The Merge?
        </Label>
        <SearchInputWrapper>
          <SearchInput
            placeholder="Search by GitHub account or Ethereum address"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={e => onChange(e)}
            value={searchValue}
          />
          <IconWrapper>
            <MagnifyingGlass
              size={"100%"}
              color={
                isFocused || searchValue.length > 0 ? colors.blue9 : "#959AAB"
              }
              weight="bold"
            />
          </IconWrapper>
        </SearchInputWrapper>
        <SearchResultWrapper>
          {loading && <SearchResultItem>Loading...</SearchResultItem>}
          {!loading &&
            searchedAccounts &&
            searchedAccounts?.length > 0 &&
            searchedAccounts.map((account, index) => {
              return (
                <SearchResultItem
                  key={account + "eligibleAccount" + index}
                  href={
                    "https://github.com/sismo-core/sismo-hub/tree/main/group-generators/generators/the-merge-contributor/index.ts"
                  }
                  target="_blank"
                >
                  <Shard size={10} color={colors.blue10} />
                  {account}
                </SearchResultItem>
              );
            })}
          {!loading && searchedAccounts?.length === 0 && (
            <SearchResultItem>No results found</SearchResultItem>
          )}
        </SearchResultWrapper>
      </Container>
    </>
  );
}

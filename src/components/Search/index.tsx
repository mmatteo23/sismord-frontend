import styled from "styled-components";
import { useState, useEffect, useMemo } from "react";
import { MagnifyingGlass } from "phosphor-react";
import colors from "../../theme/colors";
import { Shard, ShardGroup } from "../SismoReactIcon";
import { useZkConnect } from "@sismo-core/zk-connect-react";
import { zkConnectConfig } from "../../App";

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

type Props = {
  groupId: string;
}

export default function Search({ groupId }: Props): JSX.Element {
  const [isFocused, setIsFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { zkConnect } = useZkConnect({
    config: zkConnectConfig
  });

  const [membersOfGroup, setMembersOfGroup] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

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
    async function getMembersOfGroup() {
      try {
        setLoading(true);
        const group = await zkConnect.getGroup({ id: groupId });
        const _membersOfGroup = convertObjectToStringArray(group.data);
        setMembersOfGroup(_membersOfGroup);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    }
    getMembersOfGroup();
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
    if (searchValue.length > 1 && membersOfGroup.length > 0) {
      const _searchedAccounts = search(membersOfGroup, searchValue);
      return _searchedAccounts;
    } else {
      return membersOfGroup;
    }
  }, [membersOfGroup, searchValue]);

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
                  key={account + "memberOfGroup" + index}
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

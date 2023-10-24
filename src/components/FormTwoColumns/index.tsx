'use client';

import React from 'react';

import { Icon, TypeIcon } from 'components/Icone';
import { SpinnerLoading } from 'components/Spinner';
import { SmallMediumText } from 'components/Text';

import styles from './formtwocolumns.module.css';

import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { DataDishesModel } from 'models/DataDishesModel';
import { DataProductsModel } from 'models/DataProductsModel';
import { DataRolesModel } from 'models/DataRolesModel';
import { DataSpecialistsModel } from 'models/DataSpecialistsModel';
import { DataSpecialtiesModel } from 'models/DataSpecialtiesModel';
import { DataUnitsModel } from 'models/DataUnitsModel';
import { ResponseGetModel } from 'models/ResponseGetModel';

type Props = {
  headers: string[];
  headersResponse?: string[];
  response?: ResponseGetModel;
  style?: React.CSSProperties;
  isLoading?: boolean;
  onItemClick?: (firstId: any, secondId: any) => void;
  onClick?: (selectedValue: string) => void;
  onSearch?: (search: string) => void;
  startSearch?: (signal: boolean) => void;
  type?: string;
};

export function FormTwoColumns({
  headers,
  response,
  isLoading = true,
  type,
  onClick,
  onItemClick,
  onSearch,
  startSearch
}: Props): JSX.Element {
  const [dataAdapted, setDataAdapted] = React.useState<any>([]);
  const [search, setSearch] = React.useState<string>('');
  const [selectedOption, setSelectedOption] = React.useState<
    string | undefined
  >(response?.links[0]?.label);
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);

  function handleRowClick(event: React.MouseEvent<HTMLTableRowElement>) {
    const firstId = event.currentTarget.getAttribute('data-user-first-id');
    const secondId = event.currentTarget.getAttribute('data-user-second-id');
    const index = event.currentTarget.getAttribute('data-user-index');
    setSelectedIndex(Number(index));

    if (
      firstId !== undefined &&
      onItemClick !== undefined &&
      secondId !== undefined
    ) {
      onItemClick(firstId, secondId);
    }
  }

  React.useEffect(() => {
    if (
      response !== undefined &&
      response?.data !== null &&
      response?.data.length > 0
    ) {
      fixedPagination(response);
      setDataAdapted([]);
      switch (type) {
        case 'scaleSchedule':
          adptedDataSpecialist(response?.data);
          break;
        case 'newSpecialty':
          adptedDataSpecialties(response?.data);
          break;
        case 'newRole':
          adptedDataRoles(response?.data);
          break;
        case 'newProduct':
          adptedDataProducts(response?.data);
          break;
        case 'newDishe':
          adptedDataDishes(response?.data);
          break;
        default:
          break;
      }
    }
  }, [response?.data?.length]);

  async function fixedPagination(response: any) {
    const links = response.links;
    await links.map((link: any) => {
      if (
        link.label === '&laquo; Anterior' ||
        link.label === 'Próximo &raquo;'
      ) {
        links.splice(links.indexOf(link), 1);
      }
    });
  }

  async function adptedDataSpecialist(data: any) {
    data.forEach((element: DataSpecialistsModel) => {
      element.units.forEach((unit: DataUnitsModel | any) => {
        const dataAdapted = {
          firstId: element.id,
          secondId: unit.id,
          firstColumn: element.name,
          secondColumn: unit.name
        };
        setDataAdapted((oldArray: any) => [...oldArray, dataAdapted]);
      });
    });
  }

  async function adptedDataSpecialties(data: any) {
    data.forEach((element: DataSpecialtiesModel) => {
      const dataAdapted = {
        firstId: element.id,
        secondId: element.id,
        firstColumn: element.description,
        secondColumn: element.status === 0 ? 'Ativo' : 'Inativo'
      };
      setDataAdapted((oldArray: any) => [...oldArray, dataAdapted]);
    });
  }

  async function adptedDataRoles(data: any) {
    data.forEach((element: DataRolesModel) => {
      const dataAdapted = {
        firstId: element.id,
        secondId: element.id,
        firstColumn: element.field_name,
        secondColumn: 'Ativo'
      };
      setDataAdapted((oldArray: any) => [...oldArray, dataAdapted]);
    });
  }

  async function adptedDataProducts(data: any) {
    data.forEach((element: DataProductsModel) => {
      const dataAdapted = {
        firstId: element.id,
        secondId: element.id,
        firstColumn: element.description,
        secondColumn: element.status === 0 ? 'Ativo' : 'Inativo'
      };
      setDataAdapted((oldArray: any) => [...oldArray, dataAdapted]);
    });
  }

  async function adptedDataDishes(data: any) {
    data.forEach((element: DataDishesModel) => {
      const dataAdapted = {
        firstId: element.id,
        secondId: element.id,
        firstColumn: element.name,
        secondColumn:
          element.status === 0 || element.status === true ? 'Ativo' : 'Inativo'
      };
      setDataAdapted((oldArray: any) => [...oldArray, dataAdapted]);
    });
  }

  return (
    <div className={styles.bodyFormTwoColumns}>
      <div className={styles.searchBarFormTwoColumns}>
        <input
          placeholder={Strings.search}
          style={{ width: '100%' }}
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            onSearch && onSearch(event.target.value);
          }}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              startSearch && startSearch(true);
            }
          }}
        />
        <div className={styles.iconSearch}>
          <Icon
            typeIcon={TypeIcon.Search}
            size={20}
            color={Colors.gray60}
            callback={() => {
              startSearch && startSearch(true);
            }}
          />
        </div>
      </div>
      <div className={styles.containerTable}>
        {isLoading ? (
          <SpinnerLoading />
        ) : (
          <table className={styles.tableScale}>
            <thead>
              <tr className={styles.headers}>
                {headers.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataAdapted.map((row: any, index: number) => (
                <tr
                  key={index}
                  onClick={handleRowClick}
                  data-user-first-id={row.firstId}
                  data-user-second-id={row.secondId}
                  data-user-index={index}
                  style={{
                    cursor: 'pointer',
                    background:
                      selectedIndex == index ? Colors.greenDark : Colors.white,
                    color: selectedIndex == index ? Colors.white : Colors.gray90
                  }}
                >
                  <td className={styles.rows}>{row.firstColumn}</td>
                  <td className={styles.rows}>{row.secondColumn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {!isLoading ? (
        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            <select
              value={selectedOption}
              onChange={(event) => {
                const selectedValue = event.target.value;
                setSelectedOption(selectedValue);
                onClick && onClick(selectedValue);
              }}
            >
              {response?.links.map((link, index) => (
                <option key={index}>{link?.label}</option>
              ))}
            </select>
          </div>
          <SmallMediumText
            bold={false}
            style={{ lineHeight: 2, marginLeft: '2%' }}
            text={
              isLoading
                ? 'Carregando...'
                : response?.current_page === undefined
                ? 'Carregando...'
                : `Exibindo ${response?.current_page} de ${Number(
                    response?.last_page
                  )}`
            }
            color={Colors.gray70}
          />
        </div>
      ) : null}
    </div>
  );
}

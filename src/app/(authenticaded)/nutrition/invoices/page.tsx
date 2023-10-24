'use client';

import React from 'react';

import { Button } from 'components/Button';
import { Icon, TypeIcon } from 'components/Icone';
import { MenuTop } from 'components/MenuTop';
import ModalBoxInvoice from 'components/ModalBoxInvoice';
import ModalError from 'components/ModalError';
import ModalOptions from 'components/ModalOptions';
import { Table } from 'components/Table';

import styles from './invoiceslist.module.css';

import { Strings } from 'assets/Strings';
import { Colors } from 'configs/Colors_default';
import { format } from 'date-fns';
import { DataUnitsModel } from 'models/DataUnitsModel';
import { ResponseGetModel } from 'models/ResponseGetModel';
import { Prefs } from 'repository/Prefs';
import { getAllInvoices, getInvoicesPerPage } from 'services/invoices';
import { getProductsWithoutPagination } from 'services/products';
import { getAllUnitsWithoutPagination } from 'services/units';
import { getSearchedUsers } from 'services/users';

export default function ListInvoicesPage() {
  const [data, setData] = React.useState<any>(null);
  const [units, setUnits] = React.useState<any>(null);
  const [products, setProducts] = React.useState<any>(null);
  const [quantityInvoices, setQuantityInvoices] = React.useState<number>(0);
  const [invoiceRecovery, setInvoiceRecovery] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [page, setPage] = React.useState<number>(1);
  const [showBoxInvoice, setShowBoxInvoice] = React.useState<boolean>(false);
  const [showModalError, setShowModalError] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>('');
  const [showModalOptions, setShowModalOptions] =
    React.useState<boolean>(false);
  const [selectedItem, setSelectedItem] = React.useState<any>(null);

  React.useEffect(() => {
    if (search === '') {
      getInvoices();
      getUnits();
      getProducts();
    }
  }, [quantityInvoices, page, search]);

  async function getInvoices() {
    if (page === 1) {
      const response = await getAllInvoices();
      const data = response.data as ResponseGetModel;
      const dataUpdated = data;
      dataUpdated.data = dataUpdated.data.map((item: any) => {
        item.unit_name = item.unit.name || 'Sem unidade';
        item.number = item.number.toString();
        item.supplier = item.supplier.toString();
        item.date = format(new Date(item.date), 'dd/MM/yyyy');
        item.amount = Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(item.amount);
        return item;
      });
      setData(dataUpdated);
      setQuantityInvoices(data.total);
    } else {
      const response = await getInvoicesPerPage(page);
      const data = response.data as ResponseGetModel;
      const dataUpdated = data;
      dataUpdated.data = dataUpdated.data.map((item: any) => {
        item.unit_name = item.unit.name || 'Sem unidade';
        item.number = item.number.toString();
        item.supplier = item.supplier.toString();
        item.date = format(new Date(item.date), 'dd/MM/yyyy');
        item.amount = Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(item.amount);
        return item;
      });
      setData(dataUpdated);
      setQuantityInvoices(data.total);
    }
    setLoading(false);
  }

  async function getUnits() {
    let unitsPermited = JSON.parse(Prefs.getUnits()!);
    unitsPermited = unitsPermited!.map((item: DataUnitsModel) => item.id);
    const response = await getAllUnitsWithoutPagination();
    const unitsUpdated = response.data as unknown as DataUnitsModel[];

    const newUnitsPermitd: any = [];

    unitsUpdated.map((item: any) => {
      unitsPermited?.map((item2: any) => {
        if (item.id === item2) {
          newUnitsPermitd.push(item);
        }
      });
    });
    setUnits(
      newUnitsPermitd.sort((a: DataUnitsModel, b: DataUnitsModel) =>
        a.name.localeCompare(b.name)
      )
    );
  }

  async function getProducts() {
    const response = await getProductsWithoutPagination();
    const data = response.data as ResponseGetModel;
    setProducts(data);
  }

  const handleSelectionPage = (selectedValue: string) => {
    setPage(parseInt(selectedValue));
  };

  function handleItemSelection(item: any) {
    setSelectedItem(item);
    setShowModalOptions(true);
  }

  function updateQuantityInvoices(status: boolean) {
    if (status) {
      setQuantityInvoices(quantityInvoices - 1);
    }
  }

  const handleOnUpdate = (value: number) => {
    setQuantityInvoices(quantityInvoices + value);
  };

  const handleReturnItem = (item: any) => {
    setInvoiceRecovery(item);
    setShowModalOptions(false);
    setShowBoxInvoice(true);
  };

  async function handleSearch(search: string, event?: any) {
    if (event) {
      event.preventDefault();
    }
    if (search === '') {
      getInvoices();
      getUnits();
      getProducts();
    } else {
      setLoading(true);
      const response = await getSearchedUsers(search);
      const data = response.data as ResponseGetModel;
      const dataUpdated = data;
      dataUpdated.data = dataUpdated.data.map((item: any) => {
        item.unit_name = item.unit.name || 'Sem unidade';
        item.number = item.number.toString();
        item.supplier = item.supplier.toString();
        item.date = format(new Date(item.date), 'dd/MM/yyyy');
        item.amount = Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(item.amount);
        return item;
      });
      setData(dataUpdated);
      getUnits();
      getProducts();
      setQuantityInvoices(data.total);
      setLoading(false);
    }
  }

  return (
    <React.Fragment>
      <MenuTop />
      <div className={styles.bodyUnitsList}>
        <div className={styles.headerUnitsList}>
          <div className={styles.btnAddUnit}>
            <Button
              title={Strings.insertInvoice}
              type="secondary"
              onClick={() => {
                setShowBoxInvoice(true);
                setInvoiceRecovery(null);
              }}
            />
          </div>
          <div className={styles.searchBar}>
            <input
              type="search"
              placeholder={Strings.search}
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  handleSearch(search, event);
                }
              }}
            />
            <div className={styles.iconSearch}>
              <Icon
                typeIcon={TypeIcon.Search}
                size={20}
                color={Colors.gray60}
                callback={() => {
                  handleSearch(search);
                }}
              />
            </div>
          </div>
        </div>
        <div className={styles.tableUnitsList}>
          <Table
            headers={Strings.headersInvoice}
            headersResponse={Strings.headersInvoiceResponse}
            response={data}
            isLoading={loading}
            onClick={handleSelectionPage}
            onItemClick={handleItemSelection}
          />
        </div>
      </div>
      <ModalOptions
        message={Strings.whatDoYouWantToDo}
        show={
          showModalOptions &&
          selectedItem !== null &&
          selectedItem !== undefined
        }
        onHide={() => {
          setShowModalOptions(false);
        }}
        item={selectedItem}
        typeItem="invoice"
        showEdit={false}
        showView={true}
        reset={updateQuantityInvoices}
        onReturnItem={handleReturnItem}
      />
      <ModalBoxInvoice
        show={showBoxInvoice}
        onHide={() => {
          setShowBoxInvoice(false);
        }}
        units={units}
        products={products}
        onUpdate={handleOnUpdate}
        invoice={invoiceRecovery}
        onError={(error: boolean) => {
          setShowModalError(error);
        }}
      />
      <ModalError
        show={showModalError}
        onHide={() => {
          setShowModalError(false);
        }}
        message={Strings.messageErrorInsertInvoiceWithoutProducts}
      />
    </React.Fragment>
  );
}

'use client';

import React from 'react';

import { Button } from 'components/Button';
import { Icon, TypeIcon } from 'components/Icone';
import { MenuTop } from 'components/MenuTop';
import ModalBoxInvoice from 'components/ModalBoxInvoice';
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

export default function ListInvoicesPage() {
  const [data, setData] = React.useState<any>(null);
  const [units, setUnits] = React.useState<any>(null);
  const [products, setProducts] = React.useState<any>(null);
  const [quantityInvoices, setQuantityInvoices] = React.useState<number>(0);
  const [invoiceRecovy, setInvoiceRecovery] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [page, setPage] = React.useState<number>(1);
  const [showBoxInvoice, setShowBoxInvoice] = React.useState<boolean>(false);
  const [showModalOptions, setShowModalOptions] =
    React.useState<boolean>(false);
  const [selectedItem, setSelectedItem] = React.useState<any>(null);

  React.useEffect(() => {
    getInvoices();
    getUnits();
    getProducts();
  }, [quantityInvoices, page]);

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
              }}
            />
          </div>
          <div className={styles.searchBar}>
            <input type="search" placeholder={Strings.search} />
            <div className={styles.iconSearch}>
              <Icon
                typeIcon={TypeIcon.Search}
                size={20}
                color={Colors.gray60}
                callback={() => {}}
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
        invoice={invoiceRecovy}
      />
    </React.Fragment>
  );
}

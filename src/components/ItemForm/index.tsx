import { FormEvent } from 'react';

import styles from './ItemForm.module.css';

import useListStore from '../../stores/listStore';
import useFormStore from '../../stores/formStore';
import useSavedOptionsStore from '../../stores/savedOptionsStore';
import useLogsStore from '../../stores/logsStore';
import useItemForm from '../../hooks/useItemForm';

import mapOptions from '../../utils/mapOptions';
import optionsIsNotSaved from '../../utils/optionsIsSaved';
import itemFormInitialState from '../../const/itemFormState';

import { FormMode } from '../../types/FormTypes';
import ListItemType, {
    NumberOf,
    QuantityType,
} from '../../types/ListItemTypes';
import optionsForNumberOf from '../../const/optionsForNumberOf';

import QuantityInput from '../QuantityInput';
import OptionsForm from '../OptionsForm';
import FormGroup from '../FormGroup';
import Select from '../Select';

type Props = {
    setItemFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ItemForm({ setItemFormOpen }: Props) {
    const { addItem, editItem } = useListStore();
    const { formMode, targetItem } = useFormStore();
    const { savedOptions, saveOptions } = useSavedOptionsStore();
    const addNewLog = useLogsStore((state) => state.addNewLog);

    const { fields, setFields, options, setOptions, validate, errors } =
        useItemForm();

    const handleSubmit = (e: FormEvent<HTMLButtonElement>, mode: FormMode) => {
        e.preventDefault();

        if (validate()) {
            if (
                fields.qtdType === 'options' &&
                optionsIsNotSaved(options, savedOptions)
            ) {
                saveOptions(options);
            }

            const newItem: ListItemType = {
                id: mode === 'add' ? crypto.randomUUID() : targetItem.id,
                options: options,
                ...fields,
            };

            if (mode === 'add') {
                addItem(newItem);
                addNewLog({
                    item: newItem.name,
                    diff: 'Adicionado',
                });
            } else {
                editItem(newItem);

                const difference =
                    newItem.qtdType === 'number'
                        ? String(newItem.quantity - targetItem.quantity)
                        : `${newItem.options[targetItem.quantity]} > ${
                              newItem.options[newItem.quantity]
                          }`;

                if (Number(difference) != 0) {
                    addNewLog({
                        item: newItem.name,
                        diff:
                            Number(difference) > 0
                                ? `+${difference}`
                                : difference,
                    });
                }
            }

            setItemFormOpen(false);
            setFields(itemFormInitialState);
            setOptions([]);
        }
    };

    return (
        <form className={styles.form}>
            <FormGroup
                elementId={'item-name'}
                labelText={'O que é:'}
                error={errors.nameError}>
                <input
                    type='text'
                    id='item-name'
                    className='input'
                    placeholder='Nome do item'
                    value={fields.name}
                    onChange={(e) =>
                        setFields({ ...fields, name: e.target.value })
                    }
                />
            </FormGroup>
            <FormGroup elementId='item-type' labelText='Contar por:'>
                <Select
                    options={[
                        { label: 'Unidades de medida', value: 'number' },
                        { label: 'Opções', value: 'options' },
                    ]}
                    elementId={'item-type'}
                    change={(e) =>
                        setFields({
                            ...fields,
                            qtdType: e.currentTarget.dataset
                                .value as QuantityType,
                        })
                    }
                    value={
                        fields.qtdType === 'number'
                            ? 'Unidades de medida'
                            : 'Opções'
                    }
                />
            </FormGroup>

            {fields.qtdType === 'options' && (
                <FormGroup
                    elementId='item-options'
                    labelText='Opções:'
                    error={errors.optionsError}>
                    <OptionsForm options={options} setOptions={setOptions} />
                </FormGroup>
            )}

            {fields.qtdType === 'number' && (
                <FormGroup
                    elementId='item-numberOf'
                    labelText='Unidade de medida:'>
                    <Select
                        elementId='item-numberOf'
                        options={optionsForNumberOf}
                        value={fields.numberOf}
                        change={(e) =>
                            setFields({
                                ...fields,
                                numberOf: e.currentTarget.dataset
                                    .value! as NumberOf,
                            })
                        }
                    />
                </FormGroup>
            )}

            <FormGroup elementId='item-quantity' labelText='Quantidade:'>
                {fields.qtdType === 'number' ? (
                    <QuantityInput
                        size='md'
                        elementId='item-quantity'
                        value={fields.quantity}
                        change={(e) =>
                            setFields({
                                ...fields,
                                quantity: Number(e.target.value),
                            })
                        }
                    />
                ) : (
                    <Select
                        elementId='item-quantity'
                        options={mapOptions(options, 'number')}
                        change={(e) =>
                            setFields({
                                ...fields,
                                quantity: Number(e.currentTarget.dataset.value),
                            })
                        }
                        value={options[fields.quantity] || '-'}
                        placeholderOption='Nenhuma opção encontrada'
                    />
                )}
            </FormGroup>
            <FormGroup elementId='item-alert' labelText='Alertar em:'>
                {fields.qtdType === 'number' ? (
                    <QuantityInput
                        size='md'
                        elementId='item-alert'
                        value={fields.alertQuantity}
                        change={(e) =>
                            setFields({
                                ...fields,
                                alertQuantity: Number(e.target.value),
                            })
                        }
                    />
                ) : (
                    <Select
                        elementId='item-alert'
                        options={mapOptions(options, 'number')}
                        change={(e) =>
                            setFields({
                                ...fields,
                                alertQuantity: Number(
                                    e.currentTarget.dataset.value
                                ),
                            })
                        }
                        value={options[fields.alertQuantity] || '-'}
                        placeholderOption='Nenhuma opção encontrada'
                    />
                )}
            </FormGroup>
            <FormGroup elementId='item-description' labelText='Descrição:'>
                <textarea
                    className={`input ${styles.description}`}
                    id='item-description'
                    value={fields.description}
                    onChange={(e) =>
                        setFields({ ...fields, description: e.target.value })
                    }
                />
            </FormGroup>
            <button
                type='submit'
                className={`btn btn-dark ${styles.submitButton}`}
                onClick={(e) => handleSubmit(e, formMode)}>
                <i
                    className={
                        formMode === 'add' ? 'bi bi-plus-lg' : 'bi bi-check-lg'
                    }
                />
                &nbsp;{formMode === 'add' ? 'Adicionar' : 'Salvar'}
            </button>
        </form>
    );
}

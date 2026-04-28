/**
 * CMS Service
 * 
 * Esta capa de abstracción permite en el futuro cambiar el origen de los datos.
 * Actualmente (V1) devuelve la data estática importada de local (membersData.ts).
 */

import { countriesData, CountryData } from '../data/membersData';
import contentData from '../data/content.json';

export const cmsService = {
    /**
     * Obtiene la lista de representantes por país.
     */
    getCountriesAndMembers: async (): Promise<CountryData[]> => {
        return countriesData;
    },

    /**
     * Obtiene los textos de misión y visión desde content.json
     */
    getAboutContent: async () => {
        return {
            mission: contentData.quienes_somos.mision,
            vision: contentData.quienes_somos.vision,
        };
    }
};

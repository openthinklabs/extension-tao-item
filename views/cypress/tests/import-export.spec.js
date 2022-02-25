/**
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2022 (original work) Open Assessment Technologies SA ;
 */

import urls from '../utils/urls';
import selectors from '../utils/selectors';
import paths from '../utils/paths';
import { getRandomNumber } from '../../../../tao/views/cypress/utils/helpers';

describe('Import/export items', () => {
    const packagesPath = `${paths.baseItemsPath}/fixtures/packages`;

    before(() => {
        // Log in and wait for render
        cy.loginAsAdmin();
        cy.intercept('GET', `**/${selectors.treeRenderUrl}/getOntologyData**`).as('treeRender');
        cy.intercept('POST', `**/${selectors.editClassLabelUrl}`).as('editClassLabel');
        cy.visit(urls.items);
        cy.wait('@treeRender');
        cy.get(`${selectors.root} a`)
            .first()
            .click();
        cy.wait('@editClassLabel');
    });

    describe('Import items', () => {
        let className;

        before(() => {
            className = `Test E2E class ${getRandomNumber()}`;
            cy.addClassToRoot(
                selectors.root,
                selectors.itemClassForm,
                className,
                selectors.editClassLabelUrl,
                selectors.treeRenderUrl,
                selectors.addSubClassUrl
            );
            cy.clearDownloads();
        });

        after(() => {
            // Cleanup
            cy.selectNode(selectors.root, selectors.itemClassForm, className);
            cy.deleteClassFromRoot(
                selectors.root,
                selectors.itemClassForm,
                selectors.deleteClass,
                selectors.deleteConfirm,
                className,
                selectors.deleteClassUrl,
                true
            );
        });

        [{
            format: null, // QTI/APIP Content Package
            filename: 'e2e_test_item.zip',
        },{
            format: 'QTI/APIP XML Item Document',
            filename: 'e2e_test_item.xml'
        },{
            format: 'RDF',
            filename: 'e2e_test_item.rdf'
        }].forEach((testcase, index) => {
            it(`${index}: "Import - ${testcase.format || 'QTI/APIP Content Package'}"`, function () {
                cy.selectNode(selectors.root, selectors.itemClassForm, className);
                cy.importToSelectedClass(selectors.importItem, `${packagesPath}/${testcase.filename}`, selectors.importItemUrl, className, testcase.format);
                cy.wait(50); // Safe delay for working with FS in Cypress
            });
        });
    });

    describe('Export items', () => {
        const className = `Test E2E class ${getRandomNumber()}`;

        before(() => {
            // Add class
            cy.addClassToRoot(
                selectors.root,
                selectors.itemClassForm,
                className,
                selectors.editClassLabelUrl,
                selectors.treeRenderUrl,
                selectors.addSubClassUrl
            );
            // Import item for exporting target
            cy.importToSelectedClass(selectors.importItem, `${packagesPath}/e2e_item.zip`, selectors.importItemUrl, className);
            cy.selectNode(selectors.root, selectors.itemClassForm, className);
        });

        after(() => {
            // Cleanup
            cy.selectNode(selectors.root, selectors.itemClassForm, className);
            cy.deleteClassFromRoot(
                selectors.root,
                selectors.itemClassForm,
                selectors.deleteClass,
                selectors.deleteConfirm,
                className,
                selectors.deleteClassUrl,
                true
            );
        });

        // IT: Multiple format exports
        [{
            format: null, //default 'QTI Package 2.2'
        },{
            format: 'QTI Package 2.1'
        },{
            format: 'APIP Content Package'
        },{
            format: 'QTI Metadata',
        },{
            format: 'RDF'
        }].forEach((testcase, index) => {
            it(`${index}: "Export - ${testcase.format || 'QTI Package 2.2'}"`, function () {
                cy.clearDownloads();
                cy.exportFromSelectedClass(selectors.exportItem, selectors.exportItemUrl, className, testcase.format);
                cy.wait(50); // Safe delay for working with FS in Cypress
            });
        });

    });

    describe('Import and Export items', () => {
        const className = `Test E2E class ${getRandomNumber()}`;

        before(() => {
            // Add class
            cy.addClassToRoot(
                selectors.root,
                selectors.itemClassForm,
                className,
                selectors.editClassLabelUrl,
                selectors.treeRenderUrl,
                selectors.addSubClassUrl
            );
            cy.clearDownloads();
        });

        after(() => {
            // Cleanup
            cy.selectNode(selectors.root, selectors.itemClassForm, className);
            cy.deleteClassFromRoot(
                selectors.root,
                selectors.itemClassForm,
                selectors.deleteClass,
                selectors.deleteConfirm,
                className,
                selectors.deleteClassUrl,
                true
            );
        });

        it('can import/export item with shared stimulus', function () {
            cy.selectNode(selectors.root, selectors.itemClassForm, className);
            cy.importToSelectedClass(selectors.importItem, `${packagesPath}/e2e_item_shared_stimulus.zip`, selectors.importItemUrl, className);
            cy.exportFromSelectedClass(selectors.exportItem, selectors.exportItemUrl, className);
        });
    });
});

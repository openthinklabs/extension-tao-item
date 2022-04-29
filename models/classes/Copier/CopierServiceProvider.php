<?php

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
 * Copyright (c) 2022 (original work) Open Assessment Technologies SA.
 *
 * @author Andrei Shapiro <andrei.shapiro@taotesting.com>
 */

declare(strict_types=1);

namespace oat\taoItems\model\Copier;

use oat\tao\model\TaoOntology;
use oat\oatbox\event\EventManager;
use taoItems_models_classes_ItemsService;
use oat\tao\model\resources\Service\ClassCopierProxy;
use oat\tao\model\resources\Service\ClassPropertyCopier;
use oat\tao\model\resources\Service\RootClassesListService;
use oat\generis\model\fileReference\FileReferenceSerializer;
use oat\tao\model\resources\Service\ClassCopier as TaoClassCopier;
use oat\tao\model\resources\Service\InstanceCopier as TaoInstanceCopier;
use oat\generis\model\DependencyInjection\ContainerServiceProviderInterface;
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;

use function Symfony\Component\DependencyInjection\Loader\Configurator\service;

class CopierServiceProvider implements ContainerServiceProviderInterface
{
    public function __invoke(ContainerConfigurator $configurator): void
    {
        $services = $configurator->services();

        $services
            ->set(taoItems_models_classes_ItemsService::class, taoItems_models_classes_ItemsService::class)
            ->factory(taoItems_models_classes_ItemsService::class . '::singleton');

        $services
            ->set(InstanceContentCopier::class, InstanceContentCopier::class)
            ->args(
                [
                    service(FileReferenceSerializer::SERVICE_ID),
                    service(taoItems_models_classes_ItemsService::class),
                    service(EventManager::SERVICE_ID),
                ]
            );

        $services
            ->set(InstanceCopier::class, InstanceCopier::class)
            ->args(
                [
                    service(TaoInstanceCopier::class),
                    service(InstanceContentCopier::class),
                ]
            );

        $services
            ->set(TaoClassCopier::class . '::ITEMS', TaoClassCopier::class)
            ->args(
                [
                    service(RootClassesListService::class),
                    service(ClassPropertyCopier::class),
                    service(InstanceCopier::class),
                ]
            );

        $services
            ->set(ClassCopier::class, ClassCopier::class)
            ->args(
                [
                    service(TaoClassCopier::class . '::ITEMS'),
                ]
            );

        $services
            ->get(ClassCopierProxy::class)
            ->call(
                'addClassCopier',
                [
                    TaoOntology::CLASS_URI_ITEM,
                    service(ClassCopier::class),
                ]
            );
    }
}

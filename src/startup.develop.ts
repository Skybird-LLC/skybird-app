/**
 * @license
 * Copyright Vienna LLC. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://paperbits.io/license.
 */

import "es6-shim";
import "setimmediate";
import * as ko from "knockout";

import "@paperbits/knockout/registrations/knockout.editors";
import { InversifyInjector } from "@paperbits/common/injection";
import { ComponentRegistrationCommon } from "@paperbits/knockout/registrations/components.common";
import { ComponentRegistrationEditors } from "@paperbits/knockout/registrations/components.editors";
import { KnockoutRegistrationCommon } from "@paperbits/knockout/registrations/knockout.common";
import { KnockoutRegistrationWidgets } from "@paperbits/knockout/registrations/knockout.widgets";
import { KnockoutRegistrationLoaders } from "@paperbits/knockout/registrations/knockout.loaders";

import { DemoModule } from "./components/demo.module";
// import { FirebaseModule } from "@paperbits/firebase/firebase.module";

import { HtmlModule } from "@paperbits/html/html.module";
import { ModelBinderSelector } from "@paperbits/common/widgets";

import { PageViewModelBinder } from "@paperbits/knockout/widgets/page";
import { LayoutViewModelBinder } from "@paperbits/knockout/widgets/layout";
import { RowViewModelBinder } from "@paperbits/knockout/widgets/row";
import { ColumnViewModelBinder } from "@paperbits/knockout/widgets/column";
import { SectionViewModelBinder } from "@paperbits/knockout/widgets/section";
import { TextblockViewModelBinder } from "@paperbits/knockout/widgets/textblock";
import { SliderViewModelBinder } from "@paperbits/knockout/widgets/slider";
import { IViewModelBinder } from "@paperbits/common/widgets";
import { ViewModelBinderSelector } from "@paperbits/knockout/widgets";

import { OfflineObjectStorage } from "@paperbits/common/persistence";
import { AnchorMiddleware } from "@paperbits/common/persistence";
import { CoreEditModule } from "@paperbits/core/core.edit.module";
import { FormsEditModule } from "@paperbits/forms/forms.edit.module";


document.addEventListener("DOMContentLoaded", () => {
    var injector = new InversifyInjector();

    injector.bindModule(new HtmlModule());
    injector.bindModule(new ComponentRegistrationCommon());
    injector.bindModule(new ComponentRegistrationEditors());
    injector.bindModule(new KnockoutRegistrationLoaders());
    injector.bindModule(new KnockoutRegistrationCommon());
    injector.bindModule(new KnockoutRegistrationWidgets());

    //injector.bindModule(new FirebaseModule());
    injector.bindModule(new DemoModule("/data/demo.json"));

    let modelBinders = new Array();
    injector.bindInstance("modelBinderSelector", new ModelBinderSelector(modelBinders));
    modelBinders.push(injector.resolve("textModelBinder"));
    modelBinders.push(injector.resolve("sectionModelBinder"));
    modelBinders.push(injector.resolve("pageModelBinder"));
    modelBinders.push(injector.resolve("blogModelBinder"));
    modelBinders.push(injector.resolve("sliderModelBinder"));
    //editors.push(ctx.resolve("codeblockModelBinder"));

    injector.bind("htmlEditorFactory", () => {
        return {
            createHtmlEditor: () => {
                return injector.resolve("htmlEditor");
            }
        }
    })

    let viewModelBinders = new Array<IViewModelBinder<any, any>>();
    injector.bindInstance("viewModelBinderSelector", new ViewModelBinderSelector(viewModelBinders));
    injector.bind("pageViewModelBinder", PageViewModelBinder);
    injector.bind("layoutViewModelBinder", LayoutViewModelBinder);
    injector.bind("sectionViewModelBinder", SectionViewModelBinder);
    injector.bind("rowViewModelBinder", RowViewModelBinder);
    injector.bind("columnViewModelBinder", ColumnViewModelBinder);
    injector.bind("sliderViewModelBinder", SliderViewModelBinder);
    injector.bind("textblockViewModelBinder", TextblockViewModelBinder);

    viewModelBinders.push(injector.resolve("pageViewModelBinder"));
    viewModelBinders.push(injector.resolve("sectionViewModelBinder"));
    viewModelBinders.push(injector.resolve("sliderViewModelBinder"));
    viewModelBinders.push(injector.resolve("textblockViewModelBinder"));

    injector.bindModule(new CoreEditModule(modelBinders, viewModelBinders));
    injector.bindModule(new FormsEditModule(modelBinders, viewModelBinders));

    /*** Autostart ***/
    injector.resolve("contentBindingHandler");
    injector.resolve("gridBindingHandler");
    injector.resolve("lighboxBindingHandler");
    injector.resolve("draggablesBindingHandler");
    injector.resolve("widgetBindingHandler");
    injector.resolve("hostBindingHandler");
    injector.resolve("htmlEditorBindingHandler");
    injector.resolve("balloonBindingHandler");
    injector.resolve("backgroundBindingHandler");
    injector.resolve("resizableBindingHandler");
    injector.resolve("savingHandler");
    // injector.resolve("errorHandler");
    injector.resolve("knockoutValidation");

    const offlineObjectStorage = injector.resolve<OfflineObjectStorage>("offlineObjectStorage");
    const anchorMiddleware = injector.resolve<AnchorMiddleware>("anchorMiddleware");

    offlineObjectStorage.registerMiddleware(anchorMiddleware);

    ko.options["createChildContextWithAs"] = true;
    ko.applyBindings();
});



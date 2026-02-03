import { initializer } from "sulu-admin-bundle/services";
import { fieldRegistry, viewRegistry } from "sulu-admin-bundle/containers";
import { formToolbarActionRegistry } from "sulu-admin-bundle/views";
import { Input, TextArea, TextEditor } from "sulu-admin-bundle/containers/Form";
import {Config} from "sulu-admin-bundle/services/Config";

import "./translator.css";
import {
    AITranslatorConfig,
    AITranslatorToolbarAction,
    withAITranslatorButton,
} from "./containers";

// @todo Submit sulu/sulu PR: Field registry should export these constants
const FIELD_TYPE_TEXT_LINE = "text_line";
const FIELD_TYPE_TEXT_AREA = "text_area";
const FIELD_TYPE_TEXT_EDITOR = "text_editor";

const TRANSLATION_CONFIG_VIEW = "ai_translator.config";
const FIELD_TYPE_CONFIG_LINE = "config_line";

initializer.addUpdateConfigHook("ai_translator", (config, initialized) => {
    if (!initialized) {

        if (config.is_enabled) {
            // Connect translator config view
            viewRegistry.add(TRANSLATION_CONFIG_VIEW, AITranslatorConfig);

            // Connect translator toolbar
            formToolbarActionRegistry.add(
                "ai_translator.toolbar",
                AITranslatorToolbarAction
            );

            // Override sulu field types
            // This is a bit verbose and should be fixed within fieldRegistry itself
            // Another approach via webpack resolve alias lead to recursion
            // @todo Submit sulu/sulu PR: Allow overriding of fieldRegistry items
            delete fieldRegistry.fields[FIELD_TYPE_TEXT_LINE];
            delete fieldRegistry.fields[FIELD_TYPE_TEXT_AREA];
            delete fieldRegistry.fields[FIELD_TYPE_TEXT_EDITOR];

            fieldRegistry.add(FIELD_TYPE_TEXT_LINE, withAITranslatorButton(Input));
            fieldRegistry.add(
                FIELD_TYPE_TEXT_AREA,
                withAITranslatorButton(TextArea)
            );
            fieldRegistry.add(
                FIELD_TYPE_TEXT_EDITOR,
                withAITranslatorButton(TextEditor)
            );
        }
    }

    if (!initialized) {
        fieldRegistry.add(
            FIELD_TYPE_CONFIG_LINE,
            Input
        );
    }
});

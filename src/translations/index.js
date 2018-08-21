/*
   English language strings

   Localization uses https://github.com/fnando/i18n-js

   Highlights:

      1) String.t(key) loads the string value associated with key in the string table.

            For example:   String.t("enterMsgPostPlaceholder");
            returns:       'What do you want to tell the team?'

      2) If the string value contains a {{}} in it, that parameter should be passed
         into String.t(key, options).

            For example:   String.t("errUnknownStatus", { status: 200 });
            returns:       "An error occurred: (200)"

      3) For strings that vary depending on the count of items being referred to, there
         is a built-in ability to use the proper string based on the count.

            For example:   String.t("peopleScreenTeamMembers", { count: 1 })
            returns:       "1 Team Member"

            For example:   String.t("peopleScreenTeamMembers", { count: 4 })
            returns:       "4 Team Members"

            For example:   String.t("peopleScreenTeamMembers", { count: 0 })
            returns:       "No Team Members"

   NOTE: Avoid combining strings or adding formatting characters to strings in code.
         That is done using parameters (see msgInvitationToOrg for an example).

   NOTE: When adding new strings, do not add the string to other languages. After
         other language string tables exist, add this header prior to each new
         string: // TODO: NEW_STRINGS_TO_LOCALIZE

   NOTE: When removing any code that references a string in the string table, always
         search to check to see if the string key is used elsewhere and, if not, then
         you should remove the string from all languages.
*/

import i18n from 'i18n-js';
import en from './en.json';
import es from './es.json';

i18n.fallbacks = true;
i18n.translations = { en, es };

export default class String {
  static t(key, options) {
    return i18n.t(key, options);
  }
}

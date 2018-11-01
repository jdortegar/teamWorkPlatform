import _ from 'lodash';

// recursively returns all ids of folders and files in the tree
// eslint-disable-next-line import/prefer-default-export
export const getAllIdsFromTree = tree =>
  _.reduce(
    tree,
    (acc, value, key) => {
      if (key === 'files') {
        acc.files = _.concat(acc.files, value.map(f => f.file_id));
      }
      if (key === 'folders') {
        acc.folders = _.concat(acc.folders, value.map(f => f.folder_id));
        const nestedItems = value.map(getAllIdsFromTree);

        if (!_.isEmpty(nestedItems)) {
          nestedItems.forEach(item => {
            acc.folders = _.concat(acc.folders, item.folders);
            acc.files = _.concat(acc.files, item.files);
          });
        }
      }
      return acc;
    },
    { files: [], folders: [] }
  );

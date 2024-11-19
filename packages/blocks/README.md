## Blocks Backward Compatibility

Every block is an object with predefined set of properties. This properties may change in future. We can change some property, remove some from a block or add a new one. This makes dissalignment with the existing pages in the DB so we need track block versions and upgrade it aplying every change we make to the block schema. The migration process may run when a user visits the constructor page.

### How to create a migration

1. Make a change to a blocks factory method `createBlock`
2. Increment a `BLOCK_VERSION` constant
3. In a `migrateBlock` method add a new step which will align a block of prev version with latest schema. (If block.version is 3 then do this...)
4. Handle this version change in the components code. You may want to create a new version of the component or change it's code directly if it won't break UI/UX of pages which contain the older block version 

### How to upgrade existing blocks

1. Get a page from the DB
2. Use the `checkBlockUpToDate` function to check if a block needs to be updated 
3. If it needs to be updated - call the `migrateBlock` on it
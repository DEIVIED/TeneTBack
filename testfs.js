const fs = require('fs');

fs.rm('./images/les-4-fantastiques-1_jpg1646576411653.jpg', () => {
    console.log('remove success');
})
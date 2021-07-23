# Firestore Big Batch

Easily work with Firestore Batched Writes that are bigger than currently allowed
by Firestore.

## Usage

```
npm install @qualdesk/firestore-big-batch --save
```

or

```
yarn add @qualdesk/firestore-big-batch
```

### Example

```
import * as admin from 'firebase-admin'
import { BigBatch } from '@qualdesk/firestore-big-batch'

const fs = admin.firestore()
const batch = new BigBatch({ firestore: fs }) //

const ids = myListOfIdsThatMightGoOver499

ids.forEach((id) => {
  const ref = fs.collection('documents').doc(id)
  batch.set(ref, { published: true }, { merge: true })
})

await batch.commit()
```

## Warning

This will create multiple Firestore batches if you have more than 499
operations in your BigBatch, which works for simple use cases, but does not
give all the benefits of a Firestore batch.

## Todo

* better error handling when batches fail (Promise.all() is not that great)
* see if we can support runTransaction
* write tests!

## Contributing

PRs are welcoming, or you can [raise an issue](https://github.com/qualdesk/firestore-big-batch/issues/new)

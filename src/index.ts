/// <reference types="@google-cloud/firestore" />

interface Options {
  firestore: FirebaseFirestore.Firestore
}

const MAX_OPERATIONS_PER_FIRESTORE_BATCH = 499

export class BigBatch {
  private firestore: FirebaseFirestore.Firestore
  private currentBatch: FirebaseFirestore.WriteBatch
  private batchArray: Array<FirebaseFirestore.WriteBatch>
  private operationCounter: number

  constructor({ firestore }: Options) {
    this.firestore = firestore
    this.currentBatch = firestore.batch()
    this.batchArray = [this.currentBatch]
    this.operationCounter = 0
  }

  public set(
    ref: FirebaseFirestore.DocumentReference,
    data: object,
    options: FirebaseFirestore.SetOptions = {}
  ) {
    this.currentBatch.set(ref, data, options)
    this.operationCounter++
    if (this.operationCounter === MAX_OPERATIONS_PER_FIRESTORE_BATCH) {
      this.currentBatch = this.firestore.batch()
      this.batchArray.push(this.currentBatch)
      this.operationCounter = 0
    }
  }

  public update(ref: FirebaseFirestore.DocumentReference, data: object) {
    this.currentBatch.update(ref, data)
    this.operationCounter++
    if (this.operationCounter === MAX_OPERATIONS_PER_FIRESTORE_BATCH) {
      this.currentBatch = this.firestore.batch()
      this.batchArray.push(this.currentBatch)
      this.operationCounter = 0
    }
  }

  public delete(ref: FirebaseFirestore.DocumentReference) {
    this.currentBatch.delete(ref)
    this.operationCounter++
    if (this.operationCounter === MAX_OPERATIONS_PER_FIRESTORE_BATCH) {
      this.currentBatch = this.firestore.batch()
      this.batchArray.push(this.currentBatch)
      this.operationCounter = 0
    }
  }

  public commit() {
    const promises = this.batchArray.map((batch) => batch.commit())
    return Promise.all(promises)
  }
}

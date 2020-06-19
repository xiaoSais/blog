# 四、流（stream）
 
Node.js 中有四种流，可读流（Readable）、可写流（Writable）、双工流（Duplex）、在读写过程中可以修改和变换数据的 Duplex 流（Transform），所有的流都是 EventEmitter 的实例。

## 缓冲

可读流和可写流都会保存在内部的缓冲器中。

可缓冲区的大小由构造函数中的 hignWaterMark 确定。

当调用 stream.push(chunk) 时，数据会被缓存到可读流中。如果流的消费者没有调用 stream.read() 数据会被保存到内部队列中直到被消费。

一旦缓冲区大小超过 hignWaterMark 规定的值时，流会暂时从底层读取数据到缓冲区，直到缓冲区数据被消费（也就是说，流会停止调用内部的用于填充可读缓冲区的 readable._read()）。

当调用 writable.write(chunk)时，数据会被缓冲在可写流中。当内部的可写缓冲大小小于 hignWaterMark 时，调用 writable.write() 会返回true，否则返回false。

stream.pipe() 是为了限制数据的缓冲可接受程度，也就是读写速度不一致的源头与目的地不会压垮内存。

## 应用层

### 可读流



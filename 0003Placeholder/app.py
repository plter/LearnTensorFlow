import tensorflow as tf

a = tf.placeholder(tf.float32)
b = tf.placeholder(tf.float32)

c = tf.add(a, b)

s = tf.Session()

print s.run(c, {a: 3, b: 2.1})
